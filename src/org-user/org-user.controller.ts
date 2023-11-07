import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrgUserService } from './org-user.service';
import {
  CreateOrgUserDto,
  LoginOrgUserResponseDto,
} from './dto/create-org-user.dto';
import { BasicAuthVerificationGuard } from './guard/basic-auth-verification.guard';
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
// import { ApiNotFoundResponse } from '@nestjs/swagger';

@Controller('sa')
export class OrgUserController {
  constructor(private readonly orgUserService: OrgUserService) {}

  @UseGuards(BasicAuthVerificationGuard)
  @Post('login')
  @ApiCreatedResponse({
    status: 201,
    description: 'Super Admin Login',
    type: LoginOrgUserResponseDto,
  })
  login(@Body() createOrgUserDto: CreateOrgUserDto): LoginOrgUserResponseDto {
    return {
      message: 'User logged in!',
    };
  }
}
