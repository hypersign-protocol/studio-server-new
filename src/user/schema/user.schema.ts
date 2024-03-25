import { Optional } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  SERVICES,
  SERVICE_TYPES,
} from 'src/supported-service/services/iServiceList';

export interface UserAccess {
  serviceType: SERVICE_TYPES;
  access: SERVICES.CAVACH_API.ACCESS_TYPES | SERVICES.SSI_API.ACCESS_TYPES;
  expiryDate: Date;
}

export type UserDocument = User & Document;
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: false }) // as we won't get did in google login
  did?: string;

  @Prop({ required: false })
  @Optional()
  accessList: Array<UserAccess>;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 }, { unique: true });
