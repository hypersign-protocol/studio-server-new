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
    credentialFilterQuery: FilterQuery<Credential>,
  ): Promise<CredentialModel> {
    return this.credentialModel.findOne(credentialFilterQuery);
  }
  async find(
    credentialFilterQuery: FilterQuery<Credential>,
  ): Promise<Credential[]> {
    return await this.credentialModel.aggregate([
      { $match: { appId: credentialFilterQuery.appId } },
      {
        $facet: {
          totalCount: [{ $count: 'total' }],
          data: [
            { $skip: credentialFilterQuery.paginationOption.skip },
            { $limit: credentialFilterQuery.paginationOption.limit },
            {
              $project: { credentialId: 1, _id: 0 },
            },
          ],
        },
      },
    ]);
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
