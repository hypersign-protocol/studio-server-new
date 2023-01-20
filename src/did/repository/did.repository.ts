import { Did, DidDocument } from '../schemas/did.schema';
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
    return this.didModel.find(didFilterQuery);
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
