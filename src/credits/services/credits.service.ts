import { Injectable } from '@nestjs/common';
import { AuthZCreditsRepository } from '../repositories/authz.repository';
import { scope } from '../../credits/schemas/authz.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthzCreditService {
  constructor(
    private readonly authzCreditsRepository: AuthZCreditsRepository,
    private readonly config: ConfigService,
  ) {}

  async createAuthzCredits(authz: { userId; appId }) {
    return await this.authzCreditsRepository.create({
      userId: authz.userId,
      appId: authz.appId,
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      // created: new Date().toISOString(),
      creditAmmountInUhid: this.config.get('BASIC_ALLOWANCE') || '5000000uhid',
      creditScope: [
        scope.MsgRegisterDID,
        scope.MsgDeactivateDID,
        scope.MsgRegisterCredentialSchema,
        scope.MsgUpdateDID,
        scope.MsgUpdateCredentialStatus,
        scope.MsgRegisterCredentialStatus,
      ],
    });
  }

  async getCreditDetails(appId, userId) {
    return this.authzCreditsRepository.find({
      userId,
      appId,
    });
  }
}
