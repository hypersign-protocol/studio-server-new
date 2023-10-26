import { Bip39, EnglishMnemonic } from '@cosmjs/crypto';

export class VaultWallet {
  private mnemonic: EnglishMnemonic;
  didDocument: any;
  keys: any;
  constructor(mnemonic: EnglishMnemonic | string) {
    this.mnemonic =
      typeof mnemonic === 'string'
        ? (mnemonic as unknown as EnglishMnemonic)
        : mnemonic;
  }

  async Initialize() {
    const seedEntropy = Bip39.decode(this.mnemonic);
    this.keys = await globalThis.hsSSIdkInstance.did.generateKeys({
      seed: seedEntropy,
    });
    this.didDocument = await globalThis.hsSSIdkInstance.did.generate({
      publicKeyMultibase: this.keys.publicKeyMultibase,
    });
    return this;
  }
}

export class VaultWalletManager {
  static async getWallet(
    mnemonic: EnglishMnemonic | string,
  ): Promise<VaultWallet> {
    return new VaultWallet(mnemonic).Initialize();
  }
}
