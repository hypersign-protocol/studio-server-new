import { Injectable } from '@nestjs/common';
const hidWallet = require('hid-hd-wallet');
import { ConfigService } from '@nestjs/config';
import { Bip39, Slip10, Slip10RawIndex, Slip10Curve } from '@cosmjs/crypto';

@Injectable()
export class HidWalletService {
  private mnemonic;
  private offlineSigner;
  constructor(private configService: ConfigService) {}
  async generateWallet(mnemonic?: string): Promise<{
    mnemonic: string;
    address: string;
  }> {
    this.mnemonic = mnemonic;
    const hidRpc =
      this.configService.get('HID_NETWORK_RPC') ||
      'https://rpc.jagrat.hypersign.id';
    const hidApi =
      this.configService.get('HID_NETWORK_API') ||
      'https://api.jagrat.hypersign.id';
    const namespace =
      this.configService.get('HID_NETWORK_NAMESPACE') || 'testnet';
    const wallet = new hidWallet({
      hidNodeRPCUrl: hidRpc,
      hidNodeRestUrl: hidApi,
    });
    await wallet.generateWallet({ mnemonic });
    const generatedMnemonice = wallet.offlineSigner.secret.data;
    this.offlineSigner = wallet.offlineSigner;
    const hidWalletAddress = await wallet.offlineSigner.getAccounts();
    return {
      mnemonic: generatedMnemonice,
      address: hidWalletAddress[0].address,
    };
  }
  getOfflineSigner() {
    return this.offlineSigner;
  }

  async generateMnemonicToHDSeed(minHardIndex = 0) {
    if (this.mnemonic === undefined) {
      throw new Error('Mnemonic is undefined');
    }
    minHardIndex = minHardIndex + 1;
    const seed = Bip39.decode(this.mnemonic);

    const slipPathKeys = Slip10.derivePath(
      Slip10Curve.Ed25519,
      seed,
      this.makeSSIWalletPath(minHardIndex),
    );
    const seedHD = slipPathKeys.privkey;
    return seedHD;
  }

  async generateMemonicToSeedFromSlip10RawIndex(path: Array<Slip10RawIndex>) {
    const seed = Bip39.decode(this.mnemonic);
    const slipPathKeys = Slip10.derivePath(Slip10Curve.Ed25519, seed, path);
    const seedHD = slipPathKeys.privkey;
    return seedHD;
  }

  makeSSIWalletPath(minHardIndex) {
    return [
      Slip10RawIndex.hardened(44),
      Slip10RawIndex.hardened(128),
      Slip10RawIndex.hardened(100),
      Slip10RawIndex.hardened(0),
      Slip10RawIndex.hardened(minHardIndex),
    ];
  }
}
