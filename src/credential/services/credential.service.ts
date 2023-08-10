import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCredentialDto } from '../dto/create-credential.dto';
import { UpdateCredentialDto } from '../dto/update-credential.dto';
import { ConfigService } from '@nestjs/config';
import { CredentialSSIService } from './credential.ssi.service';
import { HidWalletService } from 'src/hid-wallet/services/hid-wallet.service';
import { CredentialRepository } from '../repository/credential.repository';
import { EdvService } from 'src/edv/services/edv.service';
import { DidRepository } from 'src/did/repository/did.repository';
import { HypersignDID, HypersignVerifiableCredential } from 'hs-ssi-sdk';
import { VerifyCredentialDto } from '../dto/verify-credential.dto';
import { RegisterCredentialStatusDto } from '../dto/register-credential.dto';
@Injectable()
export class CredentialService {
  constructor(
    private readonly config: ConfigService,
    private readonly credentialSSIService: CredentialSSIService,
    private readonly edvService: EdvService,
    private readonly hidWallet: HidWalletService,
    private credentialRepository: CredentialRepository,
    private readonly didRepositiory: DidRepository,
  ) {}
  async create(createCredentialDto: CreateCredentialDto, appDetail) {
    Logger.log('create() method: starts....', 'CredentialService');
    const {
      schemaId,
      subjectDid,
      schemaContext,
      type,
      issuerDid,
      expirationDate,
      fields,
      verificationMethodId,
      persist,
    } = createCredentialDto;
    const nameSpace = createCredentialDto.namespace;
    const didOfvmId = verificationMethodId.split('#')[0];

    const { edvId, edvDocId } = appDetail;
    Logger.log(
      'create() method: before initialising edv service',
      'CredentialService',
    );
    await this.edvService.init(edvId);
    const didInfo = await this.didRepositiory.findOne({
      appId: appDetail.appId,
      did: didOfvmId,
    });
    if (!didInfo || didInfo == null) {
      Logger.error('create() method: Error: No did found', 'CredentialService');
      throw new NotFoundException([
        `${verificationMethodId} not found`,
        `${verificationMethodId} is not owned by the appId ${appDetail.appId}`,
        `Resource not found`,
      ]);
    }
    const docs = await this.edvService.getDecryptedDocument(edvDocId);
    const mnemonic: string = docs.mnemonic;
    Logger.log(
      'create() method: before generating Hid wallet',
      'CredentialService',
    );
    await this.hidWallet.generateWallet(mnemonic);
    try {
      const slipPathKeys = this.hidWallet.makeSSIWalletPath(
        didInfo.hdPathIndex,
      );

      const seed = await this.hidWallet.generateMemonicToSeedFromSlip10RawIndex(
        slipPathKeys,
      );
      Logger.log(
        'create() method: before initialising HypersignDID',
        'CredentialService',
      );
      const hypersignDid = new HypersignDID();

      const { privateKeyMultibase } = await hypersignDid.generateKeys({ seed });

      const hypersignVC = await this.credentialSSIService.initateHypersignVC(
        mnemonic,
        nameSpace,
      );
      let credential;

      if (schemaId) {
        credential = await hypersignVC.generate({
          schemaId,
          subjectDid,
          issuerDid,
          fields,
          expirationDate,
        });
      } else {
        if (!schemaContext || !type) {
          throw new BadRequestException([
            'schemaContext and type is required to create a schema',
          ]);
        }
        Logger.log(
          'create() method: generating hypersignVC',
          'CredentialService',
        );
        credential = await hypersignVC.generate({
          schemaContext,
          type,
          subjectDid,
          issuerDid,
          fields,
          expirationDate,
        });
      }
      Logger.log(
        'create() method: before calling hypersignVC.issue',
        'CredentialService',
      );
      const {
        signedCredential,
        credentialStatus,
        credentialStatusRegistrationResult,
      } = await hypersignVC.issue({
        credential,
        issuerDid,
        verificationMethodId,
        privateKeyMultibase,
      });
      let edvData = undefined;
      if (persist) {
        edvData = await this.edvService.createDocument({ signedCredential });
      }
      Logger.log(
        'create() method: before creating credential doc in db',
        'CredentialService',
      );
      await this.credentialRepository.create({
        appId: appDetail.appId,
        credentialId: signedCredential.id,
        issuerDid,
        persist: persist,
        edvDocId: edvData && edvData.id ? edvData.id : '',
        transactionHash: credentialStatusRegistrationResult.transactionHash,
        type: signedCredential.type[1], // TODO : MAYBE REMOVE HARDCODING MAYBE NOT
      });
      Logger.log('create() method: ends....', 'CredentialService');

      return {
        credentialDocument: signedCredential,
        credentialStatus,
        persist,
      };
    } catch (e) {
      throw new BadRequestException([e.message]);
    }
  }

  async findAll(appDetail, paginationOption) {
    Logger.log('findAll() method: starts....', 'CredentialService');
    const skip = (paginationOption.page - 1) * paginationOption.limit;
    paginationOption['skip'] = skip;
    Logger.log('findAll() method: fetching data from db', 'CredentialService');
    return await this.credentialRepository.find({
      appId: appDetail.appId,
      paginationOption,
    });
  }

  async resolveCredential(
    credentialId: string,
    appDetail,
    retrieveCredential: boolean,
  ) {
    Logger.log('resolveCredential() method: starts....', 'CredentialService');

    const credentialDetail = await this.credentialRepository.findOne({
      appId: appDetail.appId,
      credentialId,
    });
    if (!credentialDetail || credentialDetail == null) {
      Logger.error(
        'resolveCredential() method: Error: Credential not found',
        'CredentialService',
      );
      throw new NotFoundException([
        `${credentialId} is not found`,
        `${credentialId} does not belongs to the App id: ${appDetail.appId}`,
      ]);
    }
    let credential;
    if (credentialDetail.persist === true && retrieveCredential === true) {
      const { edvId } = appDetail;
      Logger.log(
        'resolveCredential() method: before initialising edv service',
        'CredentialService',
      );
      await this.edvService.init(edvId);
      const { signedCredential } = await this.edvService.getDecryptedDocument(
        credentialDetail.edvDocId,
      );
      credential = signedCredential;
    }
    Logger.log(
      'resolveCredential() method: before initialising HypersignVerifiableCredential',
      'CredentialService',
    );
    const hypersignCredential = new HypersignVerifiableCredential();
    let credentialStatus;
    try {
      credentialStatus = await hypersignCredential.resolveCredentialStatus({
        credentialId,
      });
    } catch (e) {
      throw new BadRequestException([e.message]);
    }
    Logger.log('resolveCredential() method: ends....', 'CredentialService');

    return {
      credentialDocument: credential ? credential : undefined,
      credentialStatus,
      persist: credentialDetail.persist,
      retrieveCredential,
    };
  }

  async update(
    id: string,
    updateCredentialDto: UpdateCredentialDto,
    appDetail,
  ) {
    Logger.log('update() method: starts....', 'CredentialService');

    const { status, statusReason, issuerDid, namespace, verificationMethodId } =
      updateCredentialDto;
    const statusChange =
      status === 'SUSPEND'
        ? 'SUSPENDED'
        : status === 'REVOKE'
        ? 'REVOKED'
        : 'LIVE';
    const didOfvmId = verificationMethodId.split('#')[0];

    const { edvId, edvDocId } = appDetail;
    Logger.log(
      'update() method: before initialising edv service',
      'CredentialService',
    );
    await this.edvService.init(edvId);
    const didInfo = await this.didRepositiory.findOne({
      appId: appDetail.appId,
      did: didOfvmId,
    });
    if (!didInfo || didInfo == null) {
      Logger.error(
        'update() method: Error: didInfo not found',
        'CredentialService',
      );

      throw new NotFoundException([
        `${verificationMethodId} not found`,
        `${verificationMethodId} is not owned by the appId ${appDetail.appId}`,
        `Resource not found`,
      ]);
    }

    const docs = await this.edvService.getDecryptedDocument(edvDocId);
    const mnemonic: string = docs.mnemonic;
    await this.hidWallet.generateWallet(mnemonic);

    try {
      const slipPathKeys = this.hidWallet.makeSSIWalletPath(
        didInfo.hdPathIndex,
      );
      const seed = await this.hidWallet.generateMemonicToSeedFromSlip10RawIndex(
        slipPathKeys,
      );

      const hypersignDid = new HypersignDID();
      const { privateKeyMultibase } = await hypersignDid.generateKeys({ seed });
      const hypersignVC = await this.credentialSSIService.initateHypersignVC(
        mnemonic,
        namespace,
      );
      Logger.log(
        'update() method: before calling hypersignVC.resolveCredentialStatus to resolve cred status',
        'CredentialService',
      );
      const credentialStatus = await hypersignVC.resolveCredentialStatus({
        credentialId: id,
      });
      Logger.log(
        'update() method: before calling hypersignVC.updateCredentialStatus to update cred status on chain',
        'CredentialService',
      );
      const updatedCredResult = await hypersignVC.updateCredentialStatus({
        credentialStatus,
        issuerDid,
        verificationMethodId,
        privateKeyMultibase,
        status: statusChange,
        statusReason,
      });
      await this.credentialRepository.findOneAndUpdate(
        { appId: appDetail.appId, credentialId: id },
        { transactionHash: updatedCredResult.transactionHash },
      );
      Logger.log('update() method: ends....', 'CredentialService');

      return await hypersignVC.resolveCredentialStatus({
        credentialId: id,
      });
    } catch (e) {
      Logger.error(`update() method: Error ${e.message}`, 'CredentialService');
      throw new BadRequestException([e.message]);
    }
  }

  async verfiyCredential(verifyCredentialDto: VerifyCredentialDto, appDetail) {
    Logger.log('verfiyCredential() method: starts....', 'CredentialService');
    const { id, issuer } = verifyCredentialDto.credentialDocument;
    const credentialDetail = await this.credentialRepository.findOne({
      appId: appDetail.appId,
      credentialId: id,
    });
    if (!credentialDetail || credentialDetail == null) {
      Logger.error(
        'verfiyCredential() method: Error: Credential not found',
        'CredentialService',
      );

      throw new NotFoundException([
        `${id} is not found`,
        `${id} does not belongs to the App id: ${appDetail.appId}`,
      ]);
    }
    const issuerDetail = await this.didRepositiory.findOne({
      appId: appDetail.appId,
      did: issuer,
    });
    if (!issuerDetail || issuerDetail == null) {
      Logger.error(
        'verfiyCredential() method: Error: did not found',
        'CredentialService',
      );

      throw new NotFoundException([
        `${issuerDetail.did} is not found`,
        `${issuerDetail.did} does not belongs to the App id: ${appDetail.appId}`,
      ]);
    }
    const hypersignCredential = new HypersignVerifiableCredential();
    let verificationResult;
    try {
      Logger.log(
        'verfiyCredential() method: before calling hypersignVC.verify to verify credential',
        'CredentialService',
      );
      verificationResult = await hypersignCredential.verify({
        credential: verifyCredentialDto.credentialDocument as any, // will fix it latter
        issuerDid: issuer,
        verificationMethodId:
          verifyCredentialDto.credentialDocument.proof.verificationMethod,
      });
    } catch (e) {
      Logger.error(
        `verfiyCredential() method: Error:${e.message}`,
        'CredentialService',
      );
      throw new BadRequestException([e.message]);
    }
    Logger.log('verfiyCredential() method: ends....', 'CredentialService');

    return verificationResult;
  }

  async registerCredentialStatus(
    registerCredentialDto: RegisterCredentialStatusDto,
    appDetail,
  ) {
    Logger.log(
      'registerCredentialStatus() method: starts....',
      'CredentialService',
    );

    const { credentialStatus, credentialStatusProof, namespace } =
      registerCredentialDto;
    const { edvId, edvDocId } = appDetail;
    Logger.log(
      'registerCredentialStatus() method: initialising edv service',
      'CredentialService',
    );
    await this.edvService.init(edvId);
    const docs = await this.edvService.getDecryptedDocument(edvDocId);
    const mnemonic: string = docs.mnemonic;
    let registeredVC: { transactionHash: string };
    try {
      const hypersignVC = await this.credentialSSIService.initateHypersignVC(
        mnemonic,
        namespace,
      );
      Logger.log(
        'registerCredentialStatus() method: before calling hypersignVC.registerCredentialStatus to register credential status on chain',
        'CredentialService',
      );
      registeredVC = await hypersignVC.registerCredentialStatus({
        credentialStatus,
        credentialStatusProof,
      });
    } catch (e) {
      Logger.error(
        `registerCredentialStatus() method: Error ${e.message}`,
        'CredentialService',
      );
      throw new BadRequestException([e.message]);
    }
    Logger.log(
      'registerCredentialStatus() method: ends....',
      'CredentialService',
    );
    return { transactionHash: registeredVC.transactionHash };
  }
}
