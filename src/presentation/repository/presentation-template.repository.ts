import {
  PresentationTemplate,
  PresentationTemplateDocument,
} from '../schemas/presentation-template.schema';
import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PresentationTemplateRepository {
  constructor(
    @InjectModel(PresentationTemplate.name)
    private readonly presentationTemplateModel: Model<PresentationTemplateDocument>,
  ) {}
  async findOne(
    presentationTemplateFilterQuery: FilterQuery<PresentationTemplate>,
  ): Promise<PresentationTemplate> {
    return this.presentationTemplateModel
      .findOne(presentationTemplateFilterQuery, { __v: 0 })
      .lean();
  }
  async find(
    presentationTemplateFilterQuery: FilterQuery<PresentationTemplate>,
  ): Promise<PresentationTemplate[]> {
    return await this.presentationTemplateModel.aggregate([
      { $match: { appId: presentationTemplateFilterQuery.appId } },
      {
        $facet: {
          totalTemplatesCount: [{ $count: 'total' }],
          data: [
            { $skip: presentationTemplateFilterQuery.paginationOption.skip },
            { $limit: presentationTemplateFilterQuery.paginationOption.limit },
          ],
        },
      },
    ]);
  }

  async create(
    presentationTemplate: PresentationTemplate,
  ): Promise<PresentationTemplate> {
    const newPresentationTemplate = new this.presentationTemplateModel(
      presentationTemplate,
    );
    return newPresentationTemplate.save();
  }

  async findOneAndUpdate(
    presentationTemplateFilterQuery: FilterQuery<PresentationTemplate>,
    presentationTemplate: Partial<PresentationTemplate>,
  ): Promise<PresentationTemplate> {
    return this.presentationTemplateModel.findOneAndUpdate(
      presentationTemplateFilterQuery,
      presentationTemplate,
      {
        new: true,
      },
    );
  }

  async findOneAndDelete(
    presentationTemplateFilterQuery: FilterQuery<PresentationTemplate>,
  ): Promise<PresentationTemplate> {
    return this.presentationTemplateModel.findOneAndDelete(
      presentationTemplateFilterQuery,
    );
  }
}
