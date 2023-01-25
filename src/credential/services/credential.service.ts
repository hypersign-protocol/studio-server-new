import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCredentialDto } from '../dto/create-credential.dto';
import { UpdateCredentialDto } from '../dto/update-credential.dto';
import { ConfigService } from '@nestjs/config';
import { CredentialSSIService } from './credential.ssi.service';
import { HidWalletService } from 'src/hid-wallet/services/hid-wallet.service';
import { CredentialRepository } from '../repository/credential.repository';
import { EdvService } from 'src/edv/services/edv.service';
import { DidRepository } from 'src/did/repository/did.repository';
import { HypersignDID } from 'hs-ssi-sdk'
@Injectable()
export class CredentialService {
  constructor(private readonly config: ConfigService, private readonly credentialSSIService: CredentialSSIService, private readonly edvService: EdvService,
    private readonly hidWallet: HidWalletService, private credentialRepository: CredentialRepository, private readonly didRepositiory: DidRepository) { }
  async create(createCredentialDto: CreateCredentialDto, appDetail) {
    const { schemaId, subjectDid, subjectDidDocSigned, schemaContext, type, issuerDid, expirationDate, fields, verificationMethodId, persist } = createCredentialDto
    const nameSpace = createCredentialDto.namespace;
    const didOfvmId = verificationMethodId.split('#')[0];

    const { edvId, edvDocId } = appDetail;
    await this.edvService.init(edvId);
    const didInfo = await this.didRepositiory.findOne({
      appId: appDetail.appId,
      did: didOfvmId,
    });
    if (!didInfo || didInfo == null) {
      throw new NotFoundException([
        `${verificationMethodId} not found`,
        `${verificationMethodId} is not owned by the appId ${appDetail.appId}`,
        `Resource not found`,
      ]);
    }
    const docs = await this.edvService.getDecryptedDocument(edvDocId);
    const mnemonic: string = docs.mnemonic;
    await this.hidWallet.generateWallet(mnemonic)
    try {
      const slipPathKeys = this.hidWallet.makeSSIWalletPath(didInfo.hdPathIndex);

      const seed = await this.hidWallet.generateMemonicToSeedFromSlip10RawIndex(
        slipPathKeys,
      );

      const hypersignDid = new HypersignDID();

      const { privateKeyMultibase } = await hypersignDid.generateKeys({ seed });

      const hypersignVC = await this.credentialSSIService.initateHypersignVC(mnemonic, nameSpace)
      const credential = await hypersignVC.generate({ schemaId, subjectDid, issuerDid, fields, expirationDate })

      const { signedCredential, credentialStatus, credentialStatusProof, credentialStatusRegistrationResult } = await hypersignVC.issue({ credential, issuerDid, verificationMethodId, privateKeyMultibase })
      let edvData = undefined
      if (persist) {
        edvData = await this.edvService.createDocument({ signedCredential, credentialStatus, credentialStatusProof, credentialStatusRegistrationResult })
      }
      await this.credentialRepository.create({
        appId: appDetail.appId,
        credentialId: signedCredential.id,
        issuerDid,
        persist: persist,
        edvDocId: edvData && edvData.id ? edvData.id : "",
        transactionHash: credentialStatusRegistrationResult.transactionHash
      })
      return { credential: signedCredential, credentialStatus, persist };
    } catch (e) {
      throw new BadRequestException([e.message]);

    }

  }

  findAll(appDetail) {

    return this.credentialRepository.find({ appId: appDetail.appId })
  }

  findOne(id: number) {
    return `This action returns a #${id} credential`;
  }

  update(id: number, updateCredentialDto: UpdateCredentialDto) {
    return `This action updates a #${id} credential`;
  }

  remove(id: number) {
    return `This action removes a #${id} credential`;
  }
}
