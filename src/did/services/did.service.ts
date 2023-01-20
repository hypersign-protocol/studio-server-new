import { Injectable } from '@nestjs/common';
import { CreateDidDto } from '../dto/create-did.dto';
import { UpdateDidDto } from '../dto/update-did.dto';
import { HypersignDID } from 'hs-ssi-sdk';
import { DidRepository } from '../repository/did.repository';
import { EdvService } from 'src/edv/services/edv.service';
import { Bip39 } from '@cosmjs/crypto';
@Injectable()
export class DidService {
  constructor(
    private readonly didRepositiory: DidRepository,
    private readonly edvService: EdvService,
  ) {}

  async create(createDidDto: CreateDidDto, appDetail) {
    //: Promise<{}> { // write response format
    const nameSpace = createDidDto.method;
    const { edvId, edvDocId } = appDetail;
    await this.edvService.init(edvId);
    const docs = await this.edvService.getDecryptedDocument(edvDocId);
    const seed = Bip39.decode(docs.mnemonic);
    const hypersignDid = new HypersignDID({ namespace: nameSpace });
    const { publicKeyMultibase } = await hypersignDid.generateKeys({ seed });
    const didDoc = await hypersignDid.generate({ publicKeyMultibase });
    this.didRepositiory.create({
      did: didDoc.id,
      appId: appDetail.appId,
      status: 'initiated',
    });

    return didDoc;
  }

  findAll() {
    return `This action returns all did`;
  }

  findOne(id: number) {
    return `This action returns a #${id} did`;
  }

  update(id: number, updateDidDto: UpdateDidDto) {
    return `This action updates a #${id} did`;
  }

  remove(id: number) {
    return `This action removes a #${id} did`;
  }
}
