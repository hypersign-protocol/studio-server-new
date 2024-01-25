import { Controller, UseFilters } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from '../../utils/utils';

@UseFilters(AllExceptionsFilter)
@ApiTags('Authentication')
@Controller()
export class UserController {}
