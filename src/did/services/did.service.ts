import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDidDto } from '../dto/create-did.dto';
import { UpdateDidDto } from '../dto/update-did.dto';
import { HypersignDID } from 'hs-ssi-sdk';
import { DidRepository, DidMetaDataRepo } from '../repository/did.repository';
import { EdvService } from 'src/edv/services/edv.service';
import { Slip10RawIndex } from '@cosmjs/crypto';
import { ConfigService } from '@nestjs/config';
import { HidWalletService } from '../../hid-wallet/services/hid-wallet.service';
@Injectable()
export class DidService {
  constructor(
    private readonly didRepositiory: DidRepository,
    private readonly didMetadataRepository: DidMetaDataRepo,
    private readonly edvService: EdvService,
    private readonly config: ConfigService,
    private readonly hidWallet: HidWalletService,
  ) {}

  async create(createDidDto: CreateDidDto, appDetail): Promise<Object> {
    try {
      const nameSpace = createDidDto.method;
      const { edvId, edvDocId } = appDetail;
      await this.edvService.init(edvId);
      const docs = await this.edvService.getDecryptedDocument(edvDocId);

      const walletOptions = {
        hidNodeRestUrl: this.config.get('HID_NETWORK_API'),
        hidNodeRPCUrl: this.config.get('HID_NETWORK_RPC'),
      };

      const mnemonic: string = docs.mnemonic;
      await this.hidWallet.generateWallet(mnemonic);

      // await hidWalletInstance.generateWallet(});

      const offlineSigner = this.hidWallet.getOfflineSigner();

      const nodeRpcEndpoint = walletOptions.hidNodeRPCUrl;
      const nodeRestEndpoint = walletOptions.hidNodeRestUrl;

      const hypersignDid = new HypersignDID({
        offlineSigner,
        nodeRpcEndpoint,
        nodeRestEndpoint,
        namespace: nameSpace,
      });
      await hypersignDid.init();

      const didData = await this.didMetadataRepository.findOne({
        appId: appDetail.appId,
      });

      let hdPathIndex;
      if (didData === null) {
        hdPathIndex = 0;
      } else {
        hdPathIndex = didData.hdPathIndex + 1;
      }

      const slipPathKeys: Array<Slip10RawIndex> =
        this.hidWallet.makeSSIWalletPath(hdPathIndex);
      const seed = await this.hidWallet.generateMemonicToSeedFromSlip10RawIndex(
        slipPathKeys,
      );
      const { publicKeyMultibase, privateKeyMultibase } =
        await hypersignDid.generateKeys({ seed });

      const didDoc = await hypersignDid.generate({ publicKeyMultibase });

      const params = {
        didDocument: didDoc,
        privateKeyMultibase,
        verificationMethodId: didDoc.verificationMethod[0].id,
      };
      const registerDidDoc = await hypersignDid.register(params);
      this.didMetadataRepository.findAndReplace(
        { appId: appDetail.appId },
        {
          did: didDoc.id,
          slipPathKeys,
          hdPathIndex,
          appId: appDetail.appId,
        },
      );

      this.didRepositiory.create({
        did: didDoc.id,
        appId: appDetail.appId,
        slipPathKeys,
        hdPathIndex,
      });
      return didDoc;
    } catch (e) {
      throw new BadRequestException([e.message]);
    }
  }

  async getDidList(appDetail) {
    const didList = await this.didRepositiory.find({ appId: appDetail.appId });
    if (didList.length <= 0) {
      throw new NotFoundException([
        `No did has created for appId ${appDetail.appId}`,
      ]);
    }
    return didList;
  }

  async resolveDid(appDetail, did: string) {
    try {
      const didInfo = await this.didRepositiory.findOne({
        appId: appDetail.appId,
        did,
      });
      if (!didInfo || didInfo == null) {
        throw new NotFoundException([`Resource not found`]);
      }
      const hypersignDid = new HypersignDID();
      // To Do
      // what erro message to be sent if did is not resegistered and trying to resolve it
      //or just send this as response or throw error `{
      //     "didDocument": {},
      //     "didDocumentMetadata": null
      // }`
      const resolvedDid = await hypersignDid.resolve({ did });
      return resolvedDid;
    } catch (e) {
      throw new BadRequestException([e]);
    }
  }

  async updateDid(updateDidDto: UpdateDidDto, did: string, appDetail) {
    // To Do :- how to validate didDoc is valid didDoc
    // To Do :- should be only update those did that are generated on studio?

    if (
      updateDidDto.didDoc['id'] == undefined ||
      updateDidDto.didDoc['id'] == ''
    ) {
      throw new BadRequestException(['Invalid didDoc']);
    }
    if (updateDidDto.didDoc['id'] !== did) {
      throw new BadRequestException([
        "Did sent in param didn't match with didDoc id",
      ]);
    }
    const { edvId, edvDocId } = appDetail;
    await this.edvService.init(edvId);
    const docs = await this.edvService.getDecryptedDocument(edvDocId);
    const mnemonic: string = docs.mnemonic;
    await this.hidWallet.generateWallet(mnemonic);
    const offlineSigner = this.hidWallet.getOfflineSigner();

    const hypersignDid = new HypersignDID({
      offlineSigner,
      nodeRpcEndpoint: this.config.get('HID_NETWORK_RPC'),
      nodeRestEndpoint: this.config.get('HID_NETWORK_API'),
      namespace: '',
    });
    await hypersignDid.init();

    const didInfo = await this.didRepositiory.findOne({
      appId: appDetail.appId,
      did,
    });
    if (!didInfo || didInfo == null) {
      throw new NotFoundException([`Resource not found`]);
    }

    const resolvedDid = await hypersignDid.resolve({ did });
    if (JSON.stringify(resolvedDid.didDocument) === '{}') {
      throw new BadRequestException([
        `${did} is not yet registered on blockchain`,
      ]);
    }
    const slipPathKeys = this.hidWallet.makeSSIWalletPath(didInfo.hdPathIndex);
    const seed = await this.hidWallet.generateMemonicToSeedFromSlip10RawIndex(
      slipPathKeys,
    );
    const { privateKeyMultibase } = await hypersignDid.generateKeys({ seed });
    let updatedDid;
    if (!updateDidDto.isToDeactivateDid) {
      updatedDid = await hypersignDid.update({
        didDocument: updateDidDto.didDoc,
        privateKeyMultibase,
        verificationMethodId: updateDidDto.didDoc['verificationMethod'][0].id,
        versionId: resolvedDid.didDocumentMetadata.versionId,
      });
    } else {
      updatedDid = await hypersignDid.deactivate({
        didDocument: updateDidDto.didDoc,
        privateKeyMultibase,
        verificationMethodId: updateDidDto.didDoc['verificationMethod'][0].id,
        versionId: resolvedDid.didDocumentMetadata.versionId,
      });
    }
    return updatedDid;
  }
}
