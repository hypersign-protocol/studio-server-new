import { PartialType } from '@nestjs/swagger';
import { CreateInviteDto } from './create-person.dto';

export class UpdatePersonDto extends PartialType(CreateInviteDto) {}

export class DeletePersonDto extends PartialType(CreateInviteDto) {}
