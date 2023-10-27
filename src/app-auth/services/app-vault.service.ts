import { Logger } from '@nestjs/common';
import { VaultWalletManager } from '../../edv/services/vaultWalletManager';
import { EdvClientManagerFactoryService } from '../../edv/services/edv.clientFactory';

export default async function getAppVault(kmsId, edvId) {
  Logger.log('Inside getAppVault()', 'getAppVault');
  const { mnemonic: appMenemonic } = await global.kmsVault.getDecryptedDocument(
    kmsId,
  );
  Logger.log(
    'Inside getAppVault(), menemonic = ' + appMenemonic,
    'getAppVault',
  );
  const appVaultWallet = await VaultWalletManager.getWallet(appMenemonic);
  const appVault = await EdvClientManagerFactoryService.createEdvClientManger(
    appVaultWallet,
    edvId,
  );
  return appVault;
}
