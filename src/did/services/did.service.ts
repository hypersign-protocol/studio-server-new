import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDidDto } from '../dto/create-did.dto';
import { UpdateDidDto } from '../dto/update-did.dto';
import { HypersignDID } from 'hs-ssi-sdk';
import { DidRepository, DidMetaDataRepo } from '../repository/did.repository';
import { EdvService } from 'src/edv/services/edv.service';
import { Bip39, Slip10RawIndex } from '@cosmjs/crypto';
import { AllExceptionsFilter } from 'src/utils';
import { SignDidDto } from '../dto/sign-did.dto';
import { uuid } from 'uuidv4';
import { ConfigService } from '@nestjs/config';
import { doc } from 'prettier';
import { HidWalletService } from '../../hid-wallet/services/hid-wallet.service'
@Injectable()
export class DidService {
  constructor(
    private readonly didRepositiory: DidRepository,
    private readonly didMetadataRepository: DidMetaDataRepo,
    private readonly edvService: EdvService,
    private readonly config: ConfigService,
    private readonly hidWallet: HidWalletService
  ) { }

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

      const mnemonic: string = docs.mnemonic
      await this.hidWallet.generateWallet(
        mnemonic
      );

      // await hidWalletInstance.generateWallet(});

      const offlineSigner = this.hidWallet.getOfflineSigner();

      const nodeRpcEndpoint = walletOptions.hidNodeRPCUrl;
      const nodeRestEndpoint = walletOptions.hidNodeRestUrl;


      const hypersignDid = new HypersignDID({
        offlineSigner,
        nodeRpcEndpoint,
        nodeRestEndpoint,
        namespace: nameSpace
      });
      await hypersignDid.init()

      const didData = await this.didMetadataRepository.findOne({ appId: appDetail.appId })

      let hdPathIndex
      if (didData===null) {
        hdPathIndex = 0
      } else {
        hdPathIndex=didData.hdPathIndex+ 1
      }


      const slipPathKeys: Array<Slip10RawIndex> = this.hidWallet.makeSSIWalletPath(hdPathIndex)
      const seed = await this.hidWallet.generateMemonicToSeedFromSlip10RawIndex(slipPathKeys)


      const { publicKeyMultibase, privateKeyMultibase } =
        await hypersignDid.generateKeys({ seed });

      let didDoc = await hypersignDid.generate({ publicKeyMultibase });

      const params = {
        didDocument: didDoc,
        privateKeyMultibase,
        verificationMethodId: didDoc.verificationMethod[0].id, // To Do need to figure out what index value to be passed
      };
      // const params = {
      //   didDocument: didDoc,
      //   privateKeyMultibase,
      //   challenge: uuid(),
      //   domain: 'fyre.domain', // To Do:- need to figure out what should be domain
      //   verificationMethodId: didDoc.verificationMethod[0].id, // To Do need to figure out what index value to be passed
      // };


      const registerDidDoc = await hypersignDid.register(params);

      //  console.log(SignedDidDoc);
      // params = {
      //   didDocument: didDoc,
      //   privateKeyMultibase,
      //   challenge: uuid(),
      //   domain: 'fyre.domain', // To Do:- need to figure out what should be domain
      //   verificationMethodId: didDoc.verificationMethod[0].id, // To Do need to figure out what index value to be passed
      // };

      this.didMetadataRepository.findAndReplace({appId:appDetail.appId},{
        did: didDoc.id,
        slipPathKeys,
        hdPathIndex,
        appId:appDetail.appId
      })

      this.didRepositiory.create({
        did: didDoc.id,
        appId: appDetail.appId,
        slipPathKeys,
        hdPathIndex

      });
      return didDoc;
    } catch (e) {
      throw new BadRequestException([e.message])

    }
  }

  async getDidList(appDetail) {
    const didList = await this.didRepositiory.find({ appId: appDetail.appId });
    if (didList.length <= 0) {
      throw new BadRequestException([
        `No did has created for appId ${appDetail.appId}`,
      ]);
    }
    return didList;
  }

  async signDid(appDetail, signDidDto: SignDidDto) {
    // console.log(appDetail);
    const { edvId, edvDocId } = appDetail;
    await this.edvService.init(edvId);
    const docs = await this.edvService.getDecryptedDocument(edvDocId);
    const seed = Bip39.decode(docs.mnemonic);
    const hypersignDid = new HypersignDID();

    const { privateKeyMultibase } = await hypersignDid.generateKeys({ seed });
    console.log(docs);
    const params = { ...signDidDto, privateKeyMultibase };
    console.log(params);
    let signedDocument;
    try {
      signedDocument = await hypersignDid.sign(params);
    } catch (e) {
      console.log(e);
    }
    console.log(signedDocument);
    console.log(signedDocument);
    return signedDocument;
    //findOne(id: number) {
    // return `This action returns a #${id} did`;
  }

  update(id: number, updateDidDto: UpdateDidDto) {
    return `This action updates a #${id} did`;
  }

  remove(id: number) {
    return `This action removes a #${id} did`;
  }

  // async fetchEdvDocument(edvId: string, edvDocId: string) {

  // }
}
