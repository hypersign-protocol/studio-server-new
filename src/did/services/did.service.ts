import { Injectable } from '@nestjs/common';
import { CreateDidDto } from '../dto/create-did.dto';
import { UpdateDidDto } from '../dto/update-did.dto';
// const { HypersignDid } = require('hs-ssi-sdk');
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
    const nameSpace = createDidDto.method;
    const { edvId, edvDocId } = appDetail;
    await this.edvService.init(edvId);
    const docs = await this.edvService.getDecryptedDocument(edvDocId);
    console.log(docs.mnemonic);
    
    const seed=Bip39.decode(docs.mnemonic)
    const hypersignDid = new HypersignDID({namespace:'testnet'});
    const {publicKeyMultibase}=await hypersignDid.generateKeys({seed});
    const did=await hypersignDid.generate({publicKeyMultibase})
    
console.log(did);

    return 'This action adds a new did';
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
