import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import {
  CreateSchemaDto,
  createSchemaResponse,
} from '../dto/create-schema.dto';
import { HypersignSchema } from 'hs-ssi-sdk';
import { ConfigService } from '@nestjs/config';
import { SchemaSSIService } from './schema.ssi.service';
import { HidWalletService } from 'src/hid-wallet/services/hid-wallet.service';
import { EdvService } from 'src/edv/services/edv.service';
import { DidRepository } from 'src/did/repository/did.repository';
import { HypersignDID } from 'hs-ssi-sdk';
import { SchemaRepository } from '../repository/schema.repository';

@Injectable({ scope: Scope.REQUEST })
export class SchemaService {
  constructor(
    private readonly schemaRepository: SchemaRepository,
    private readonly config: ConfigService,
    private readonly schemaSSIservice: SchemaSSIService,
    private readonly edvService: EdvService,
    private readonly hidWallet: HidWalletService,
    private readonly didRepositiory: DidRepository,
  ) {}
  async create(
    createSchemaDto: CreateSchemaDto,
    appDetail,
  ): Promise<createSchemaResponse> {
    let { schema } = createSchemaDto;
    const { namespace, verificationMethodId } = createSchemaDto;
    const { author } = schema;
    const { edvId, edvDocId } = appDetail;

    const didOfvmId = verificationMethodId.split('#')[0];

    await this.edvService.init(edvId);

    const didInfo = await this.didRepositiory.findOne({
      appId: appDetail.appId,
      did: didOfvmId,
    });
    if (!didInfo || didInfo == null) {
      throw new NotFoundException([
        `${didOfvmId} not found`,
        `${didOfvmId} is not owned by the appId ${appDetail.appId}`,
        `Resource not found`,
      ]);
    }
    const docs = await this.edvService.getDecryptedDocument(edvDocId);
    const mnemonic: string = docs.mnemonic;
    const hypersignSchema = await this.schemaSSIservice.initiateHypersignSchema(
      mnemonic,
      namespace,
    );
    const slipPathKeys = this.hidWallet.makeSSIWalletPath(didInfo.hdPathIndex);
    try {
      const seed = await this.hidWallet.generateMemonicToSeedFromSlip10RawIndex(
        slipPathKeys,
      );
      const hypersignDid = new HypersignDID();
      const { privateKeyMultibase } = await hypersignDid.generateKeys({ seed });

      schema = await hypersignSchema.generate(schema);

      const signedSchema = await hypersignSchema.sign({
        privateKeyMultibase,
        schema,
        verificationMethodId: verificationMethodId,
      });
      const registeredSchema = await hypersignSchema.register({
        schema: signedSchema,
      });

      await this.schemaRepository.create({
        schemaId: signedSchema.id,
        appId: appDetail.appId,
        authorDid: author,
        transactionHash: registeredSchema.transactionHash,
      });

      return {
        schemaId: signedSchema.id,
        transactionHash: registeredSchema.transactionHash,
      };
    } catch (error) {
      throw new BadRequestException([error.message]);
    }
  }

  async getSchemaList(appDetial, paginationOption) {
    const skip = (paginationOption.page - 1) * paginationOption.limit;
    paginationOption['skip'] = skip;
    const schemaList = await this.schemaRepository.find({
      appId: appDetial.appId,
      paginationOption,
    });
    if (schemaList.length <= 0) {
      throw new NotFoundException([
        `No schema has created for appId ${appDetial.appId}`,
      ]);
    }
    return schemaList.map((x) => x.schemaId);
  }

  async resolveSchema(schemaId: string, appDetail) {
    const schemaDetail = await this.schemaRepository.findOne({
      appId: appDetail.appId,
    });
    if (!schemaDetail || schemaDetail == null) {
      throw new NotFoundException([
        `${schemaId} is not found`,
        `${schemaId} does not belongs to the App id: ${appDetail.appId}`,
      ]);
    }
    const hypersignSchema = new HypersignSchema();
    const resolvedSchema = await hypersignSchema.resolve({ schemaId });
    return resolvedSchema;
  }
}
