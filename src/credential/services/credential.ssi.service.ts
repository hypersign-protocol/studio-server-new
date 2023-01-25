import { Injectable, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { HypersignVerifiableCredential } from 'hs-ssi-sdk'
import { HidWalletService } from "src/hid-wallet/services/hid-wallet.service";


@Injectable({scope:Scope.REQUEST})
export class CredentialSSIService {
    constructor(private readonly config: ConfigService, private readonly hidWallet: HidWalletService) {

    }


    async initateHypersignVC(mnemonic: string, namespace: string) {        
        const nodeRpcEndpoint = this.config.get('HID_NETWORK_RPC')
        const nodeRestEndpoint = this.config.get('HID_NETWORK_API')
        
        await this.hidWallet.generateWallet(mnemonic);        
        const offlineSigner = this.hidWallet.getOfflineSigner();                
        const hypersignVC=new HypersignVerifiableCredential({
            offlineSigner,
            nodeRpcEndpoint,
            nodeRestEndpoint,
            namespace: namespace
        })

        await hypersignVC.init()
        return hypersignVC
    }
}