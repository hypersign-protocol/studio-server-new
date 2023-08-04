import {
  BadRequestException,
  Injectable,
  Logger,
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
import { Schemas } from '../schemas/schemas.schema';
import { RegisterSchemaDto } from '../dto/register-schema.dto';
import { Namespace } from 'src/did/dto/create-did.dto';

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
    Logger.log('SchemaService:: create() method: starts....');
    const { schema } = createSchemaDto;
    const { namespace, verificationMethodId } = createSchemaDto;
    const { author } = schema;
    const { edvId, edvDocId } = appDetail;
    const didOfvmId = verificationMethodId.split('#')[0];
    Logger.log('SchemaService:: create() method: initialising edv service ');
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
    Logger.log('SchemaService:: create() method: initialising hypersignSchema');

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
      Logger.log('SchemaService:: create() method: generating key pair starts');
      const { privateKeyMultibase } = await hypersignDid.generateKeys({ seed });
      Logger.log(
        'SchemaService:: create() method generating new using hypersignSchema',
      );

      const generatedSchema = await hypersignSchema.generate(schema);
      Logger.log('SchemaService:: create() method: signing new schema');
      const signedSchema = await hypersignSchema.sign({
        privateKeyMultibase,
        schema: generatedSchema,
        verificationMethodId: verificationMethodId,
      });
      Logger.log(
        'SchemaService:: create() method: registering new schema to the blockchain',
      );

      const registeredSchema = await hypersignSchema.register({
        schema: signedSchema,
      });
      Logger.log(
        'SchemaService:: create() method: storing schema information to DB',
      );
      await this.schemaRepository.create({
        schemaId: signedSchema.id,
        appId: appDetail.appId,
        authorDid: author,
        transactionHash: registeredSchema['transactionHash'],
      });
      Logger.log('SchemaService:: create() method: ends');
      return {
        schemaId: signedSchema.id,
        transactionHash: registeredSchema['transactionHash'],
      };
    } catch (error) {
      Logger.error(
        `SchemaService: create() method: Error occuered ${error.message}`,
      );
      throw new BadRequestException([error.message]);
    }
  }

  async getSchemaList(appDetial, paginationOption): Promise<Schemas[]> {
    Logger.log('SchemaService:: getSchemaList() method: starts....');

    const skip = (paginationOption.page - 1) * paginationOption.limit;
    paginationOption['skip'] = skip;
    Logger.log('SchemaService:: getSchemaList() method: fetching data from DB');

    const schemaList = await this.schemaRepository.find({
      appId: appDetial.appId,
      paginationOption,
    });
    if (schemaList.length <= 0) {
      Logger.error(
        'SchemaService:: getSchemaList() method: no schema found in db ',
      );

      throw new NotFoundException([
        `No schema has created for appId ${appDetial.appId}`,
      ]);
    }
    return schemaList;
  }

  async resolveSchema(schemaId: string) {
    Logger.log('SchemaService:: resolveSchema() method: starts....');
    Logger.log(
      'SchemaService:: resolveSchema() method: creating instance of hypersign schema',
    );

    const hypersignSchema = new HypersignSchema();
    Logger.log(
      'SchemaService:: resolveSchema() method: resolving schema from blockchain',
    );

    const resolvedSchema = await hypersignSchema.resolve({ schemaId });
    if (resolvedSchema == undefined) {
      Logger.error(
        'SchemaService:: resolveSchema() method: Error whilt resolving schema',
      );
      throw new NotFoundException([`${schemaId} is not chain`]);
    }
    return resolvedSchema;
  }

  async registerSchema(
    registerSchemaDto: RegisterSchemaDto,
    appDetail,
  ): Promise<{ transactionHash: string }> {
    Logger.log('SchemaService:: registerSchema() method: starts....');

    const { edvId, edvDocId } = appDetail;
    const { schemaDocument, schemaProof } = registerSchemaDto;
    Logger.log(
      'SchemaService:: registerSchema() method: initialising edv service ',
    );

    await this.edvService.init(edvId);
    const docs = await this.edvService.getDecryptedDocument(edvDocId);
    const mnemonic: string = docs.mnemonic;
    const namespace = Namespace.testnet;
    Logger.log(
      'SchemaService:: registerSchema() method: initialising hypersignSchema',
    );

    const hypersignSchema = await this.schemaSSIservice.initiateHypersignSchema(
      mnemonic,
      namespace,
    );
    let registeredSchema = {} as { transactionHash: string };
    schemaDocument['proof'] = schemaProof;
    Logger.log(
      'SchemaService:: registerSchema() method: registering schema on the blockchain',
    );
    try {
      registeredSchema = await hypersignSchema.register({
        schema: schemaDocument,
      });
    } catch (e) {
      Logger.error(
        'SchemaService:: registerSchema() method: Error while registering schema',
      );
      throw new BadRequestException([e.message]);
    }
    return { transactionHash: registeredSchema.transactionHash };
  }
}
