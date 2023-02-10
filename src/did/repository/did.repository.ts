import {
  Did,
  DidDocument,
  DidDocumentMetaData,
  DidMetaData,
} from '../schemas/did.schema';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DidRepository {
  constructor(
    @InjectModel(Did.name) private readonly didModel: Model<DidDocument>,
  ) {}

  async findOne(didFilterQuery: FilterQuery<Did>): Promise<Did> {
    return this.didModel.findOne(didFilterQuery);
  }
  async find(didFilterQuery: FilterQuery<Did>): Promise<Did[]> {
    return await this.didModel.aggregate([
      { $match: { appId: didFilterQuery.appId } },
      {
        $facet: {
          totalCount: [{ $count: 'total' }],
          data: [
            { $skip: didFilterQuery.option.skip },
            { $limit: didFilterQuery.option.limit },
            {
              $project: { did: 1, _id: 0 },
            },
          ],
        },
      },
    ]);
  }

  async create(did: Did): Promise<Did> {
    const newDid = new this.didModel(did);
    return newDid.save();
  }

  async findOneAndUpdate(
    didFilterQuery: FilterQuery<Did>,
    did: Partial<Did>,
  ): Promise<Did> {
    return this.didModel.findOneAndUpdate(didFilterQuery, did, { new: true });
  }
}

@Injectable()
export class DidMetaDataRepo {
  constructor(
    @InjectModel(DidMetaData.name)
    private readonly didModel: Model<DidDocumentMetaData>,
  ) {}

  async findOne(
    didFilterQuery: FilterQuery<DidMetaData>,
  ): Promise<DidMetaData> {
    return this.didModel.findOne(didFilterQuery);
  }
  async find(didFilterQuery: FilterQuery<DidMetaData>): Promise<DidMetaData[]> {
    return this.didModel.find(didFilterQuery);
  }

  async create(did: DidMetaData): Promise<DidMetaData> {
    const newDid = new this.didModel(did);
    return newDid.save();
  }

  async findAndReplace(
    didFilterQuery: FilterQuery<DidMetaData>,
    did: DidMetaData,
  ): Promise<DidMetaData> {
    return this.didModel.findOneAndReplace(didFilterQuery, did, {
      upsert: true,
    });
  }

  async findOneAndUpdate(
    didFilterQuery: FilterQuery<DidMetaData>,
    did: Partial<DidMetaData>,
  ): Promise<Did> {
    return this.didModel.findOneAndUpdate(didFilterQuery, did, {
      upsert: true,
    });
  }
}
