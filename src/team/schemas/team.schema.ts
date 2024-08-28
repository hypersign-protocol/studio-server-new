import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TeamDocument = Team & Document;

@Schema({ timestamps: true })
export class Team {
  @Prop({ required: true })
  admin: string;
  @Prop({ required: true })
  teamName: string;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
TeamSchema.index({ admin: 1, teamName: 1 }, { unique: true });
