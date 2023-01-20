import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDidDto } from '../dto/create-did.dto';
import { UpdateDidDto } from '../dto/update-did.dto';
import { HypersignDID } from 'hs-ssi-sdk';
import { DidRepository } from '../repository/did.repository';
import { EdvService } from 'src/edv/services/edv.service';
import { Bip39 } from '@cosmjs/crypto';
import { AllExceptionsFilter } from 'src/utils';
import { SignDidDto } from '../dto/sign-did.dto';
import { uuid } from 'uuidv4';

@Injectable()
export class DidService {
  constructor(
    private readonly didRepositiory: DidRepository,
    private readonly edvService: EdvService,
  ) {}

  async create(createDidDto: CreateDidDto, appDetail): Promise<Object> {
    try {
      const nameSpace = createDidDto.method;
      const { edvId, edvDocId } = appDetail;
      await this.edvService.init(edvId);
      const docs = await this.edvService.getDecryptedDocument(edvDocId);
      const seed = Bip39.decode(docs.mnemonic);
      const hypersignDid = new HypersignDID({ namespace: nameSpace });
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
      this.didRepositiory.create({
        did: didDoc.id,
        appId: appDetail.appId,
      });
      console.log(didDoc);
      return didDoc;
    } catch (e) {
      console.log(e);
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
