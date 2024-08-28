import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CreateInviteDto {
  @ApiProperty({
    name: 'emailId',
    type: String,
  })
  @IsEmail()
  emailId: string;
}

export class InviteResponseDTO {
  @ApiProperty({
    name: 'invitor',
    type: String,
    example: '61e4196c-0ebf-4481-bbde-2f008b1b24f2',
  })
  invitor: string;
  @ApiProperty({
    name: 'invitee',
    type: String,
    example: '61e4196c-0ebf-4481-bbde-2f008b1b24f2',
  })
  invitee: string;
  @ApiProperty({
    name: 'invitationCode',
    type: String,
    example: '61e4196c-0ebf-4481-bbde-2f008b1b24f2',
  })
  invitationCode: string;

  @ApiProperty({
    name: 'accepted',
    type: Boolean,
    example: false,
  })
  accepted: string;

  @ApiProperty({
    name: 'invitationValidTill',
    type: Date,
    example: false,
  })
  invitationValidTill: string;

  @ApiProperty({
    name: 'acceptedAt',
    type: Date,
    example: false,
  })
  acceptedAt: string;
}

export class PeopleListDTO {
  @ApiProperty({
    name: 'userId',
    type: String,
    example: 'user-haajakgoa-axli',
  })
  userId: string;

  @ApiProperty({
    name: 'email',
    type: String,
    example: 'email@gmail.com',
  })
  email: string;

  @ApiProperty({
    name: 'accessList',
    type: Array,
    example: [
      {
        serviceType: 'SSI_API',
        access: 'ALL',
        expiryDate: null,
      },
      {
        serviceType: 'CAVACH_API',
        access: 'READ_USER_CONSENT',
        expiryDate: null,
      },
      {
        serviceType: 'CAVACH_API',
        access: 'WRITE_USER_CONSENT',
        expiryDate: null,
      },
      {
        serviceType: 'CAVACH_API',
        access: 'WRITE_SESSION',
        expiryDate: null,
      },
      {
        serviceType: 'CAVACH_API',
        access: 'WRITE_PASSIVE_LIVELINESS',
        expiryDate: null,
      },
      {
        serviceType: 'CAVACH_API',
        access: 'WRITE_DOC_OCR',
        expiryDate: null,
      },
    ],
  })
  accessList: Array<object>;
  @ApiProperty({
    name: 'authenticators',
    type: Array,
  })
  authenticators: Array<object>;
}

export class PeopleListResponseDTO {
  @ApiProperty({
    name: 'peoples',
    type: PeopleListDTO,
    isArray: true,
  })
  peoples: PeopleListDTO;
}
