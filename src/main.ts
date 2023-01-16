import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { existDir, createDir, store, deleteFile } from './utils'
import { HypersignSSISdk } from 'hs-ssi-sdk'
const hidWallet = require('hid-hd-wallet')
import { Bip39, EnglishMnemonic } from '@cosmjs/crypto'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Adding prefix to our api

  const walletOptions = {
    hidNodeRestUrl: process.env.HID_NETWORK_API,
    hidNodeRPCUrl: process.env.HID_NETWORK_RPC,
  }
  const hidWalletInstance = new hidWallet(walletOptions)
  await hidWalletInstance.generateWallet({ mnemonic: process.env.HID_WALLET_MNEMONIC })

 
  const offlineSigner = hidWalletInstance.offlineSigner
  const nodeRpcEndpoint = walletOptions.hidNodeRPCUrl
  const nodeRestEndpoint = walletOptions.hidNodeRestUrl
  const namespace = 'testnet'
  const hsSSIdkInstance = new HypersignSSISdk({ offlineSigner, nodeRpcEndpoint, nodeRestEndpoint, namespace } )
  await hsSSIdkInstance.init();
  const mnemonic_EnglishMnemonic: EnglishMnemonic = process.env.HID_WALLET_MNEMONIC as unknown as EnglishMnemonic
  const seedEntropy = Bip39.decode(mnemonic_EnglishMnemonic)
  const keys = await hsSSIdkInstance.did.generateKeys({ seed: seedEntropy })
  const edvDid = await hsSSIdkInstance.did.generate({ publicKeyMultibase: keys.publicKeyMultibase })
  app.setGlobalPrefix('api/v1');
  if (!existDir(process.env.EDV_CONFIG_DIR)) {
    createDir(process.env.EDV_CONFIG_DIR)
  }
  if (!existDir(process.env.EDV_DID_FILE_PATH)) {
    store(edvDid, process.env.EDV_DID_FILE_PATH)
  }
  if (!existDir(process.env.EDV_KEY_FILE_PATH)) {
    store(keys, process.env.EDV_KEY_FILE_PATH)
  }
  const config = new DocumentBuilder()
    .setTitle('Entity Studio API Documentation')
    .setDescription('Open API Documentation of the Entity Studio')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(3001);
}
bootstrap();
