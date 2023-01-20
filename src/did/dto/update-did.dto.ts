import { PartialType } from '@nestjs/swagger';
import { CreateDidDto } from './create-did.dto';

export class UpdateDidDto extends PartialType(CreateDidDto) {}
