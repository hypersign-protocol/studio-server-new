import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class TeamMember {
  @Prop({
    required: true,
  })
  userId: string;
  @Prop({
    required: true,
  })
  teamId: string;
  @Prop({
    required: true,
  })
  role: string;
}

export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember);

TeamMemberSchema.index({ userId: 1, teamId: 1 }, { unique: true });
