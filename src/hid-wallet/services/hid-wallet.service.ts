import { Injectable } from '@nestjs/common';
const hidWallet = require('hid-hd-wallet')
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HidWalletService {

    constructor(private configService: ConfigService) { }
    async generateWallet(mnemonic?: string): Promise<{
        mnemonic:string,
        address:string
    }> {

        const hidRpc = this.configService.get('HID_NETWORK_RPC') || "https://rpc.jagrat.hypersign.id"
        const hidApi = this.configService.get('HID_NETWORK_API') || "https://api.jagrat.hypersign.id"
        const namespace = this.configService.get('HID_NETWORK_NAMESPACE') || "testnet"
        const wallet = new hidWallet({
            hidNodeRPCUrl: hidRpc, hidNodeRestUrl: hidApi
        })
        await wallet.generateWallet({ mnemonic })
        const generatedMnemonice = wallet.offlineSigner.secret.data
        const hidWalletAddress = await wallet.offlineSigner.getAccounts()
        return {
            mnemonic: generatedMnemonice,
            address: hidWalletAddress[0].address 
        }
    }

}
