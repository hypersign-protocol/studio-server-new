import { Injectable } from '@nestjs/common';
import { Credential, CredentialModel } from '../schemas/credntial.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class CredentialRepository {
  constructor(
    @InjectModel(Credential.name)
    private readonly credentialModel: Model<CredentialModel>,
  ) {}

  async findOne(
    credentialFilterQuery: FilterQuery<CredentialModel>,
  ): Promise<CredentialModel> {
    return this.credentialModel.findOne(credentialFilterQuery);
  }
  async find(
    credentialFilterQuery: FilterQuery<CredentialModel>,
  ): Promise<CredentialModel[]> {
    return this.credentialModel.distinct('credentialId', credentialFilterQuery);
  }

  async create(credential: Credential): Promise<CredentialModel> {
    const newCredential = new this.credentialModel(credential);
    return newCredential.save();
  }

  async findOneAndUpdate(
    credentialFilterQuery: FilterQuery<CredentialModel>,
    credential: Partial<CredentialModel>,
  ): Promise<CredentialModel> {
    return this.credentialModel.findOneAndUpdate(
      credentialFilterQuery,
      credential,
      { new: true },
    );
  }
}
