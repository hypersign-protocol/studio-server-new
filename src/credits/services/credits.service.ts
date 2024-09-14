import { Injectable, Logger } from '@nestjs/common';
import { AuthZCreditsRepository } from '../repositories/authz.repository';
import { scope } from '../../credits/schemas/authz.schema';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { APP_ENVIRONMENT } from 'src/supported-service/services/iServiceList';

@Injectable()
export class AuthzCreditService {
  constructor(
    private readonly authzCreditsRepository: AuthZCreditsRepository,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  async createAuthzCredits(authz: { userId; appId }) {
    return await this.authzCreditsRepository.create({
      userId: authz.userId,
      appId: authz.appId,
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      // created: new Date().toISOString(),
      credit: {
        amount: this.config.get('BASIC_ALLOWANCE') || '5000000',
        denom: 'uhid',
      },
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

  async grantCavachCredit(
    subdomain: string,
    appId: string,
    environmentMode: APP_ENVIRONMENT,
    tenantUrl: string,
  ) {
    Logger.log(
      'grantCavachCredit() method to grant free credit to cavach service',
      'AuthZCreditService',
    );
    const payload = {
      purpose: 'CreditRecharge',
      amount: 2100, // will take this as function parameter later
      amountDenom: 'uHID',
      validityPeriod: 6,
      serviceId: appId,
      validityPeriodUnit: 'MONTH',
      env: environmentMode,
      subdomain,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '5m',
      secret: this.config.get('JWT_SECRET'),
    });
    fetch(`${tenantUrl}api/v1/credit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/json',
        authorization: `Bearer ${token}`,
      },
    }).catch((error) => {
      Logger.error('Failed to grant credit:', error);
    });
  }
}
