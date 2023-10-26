import { HypersignEdvClientEd25519VerificationKey2020 } from 'hypersign-edv-client';
import {
  IResponse,
  IEncryptionRecipents,
} from 'hypersign-edv-client/build/Types';
import { X25519KeyAgreementKey2020 } from '@digitalbazaar/x25519-key-agreement-key-2020';
import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';
import { VaultWallet } from './vaultWalletManager';
type EDVDocType = {
  document: object;
  documentId?: string;
  sequence?: number;
  metadata?: object;
  edvId: string;
  recipients?: Array<IEncryptionRecipents>;
  indexs?: Array<{ index: string; unique: boolean }>;
};

export interface IEdvClientManager {
  didDocument: object;
  edvId?: string;
  initate(): Promise<IEdvClientManager>;
  insertDocument(doc: EDVDocType): any;
  updateDocument(): any;
  deleteDocument(): any;
  prepareEdvDocument(
    content: object,
    indexes: Array<{ index: string; unique: boolean }>,
    recipients?: Array<IEncryptionRecipents>,
  ): EDVDocType;
}

const process = {
  vaultUrl: 'https://stage.hypermine.in/vault',
};

export class EdvClientManger implements IEdvClientManager {
  didDocument: any;
  edvId?: string;
  private keyResolver: any;
  private authenticationKey: any;
  private vault: any;
  private recipient: any;
  private vaultWallet: VaultWallet;
  constructor(vaultWallet: VaultWallet, edvId?: string) {
    this.vaultWallet = vaultWallet;
    this.edvId = edvId;
    this.didDocument = this.vaultWallet.didDocument;
    this.keyResolver = async ({ id }: { id: string }) => {
      // Resolve the key from the DID Document or from the blockchain or from any other source
      // sample authentication key after did resolution
      // Caution: This is just a sample snippet (This will cause error). You should resolve the key from the DID Document or from the blockchain or from any other source

      const authenticationKey = {
        '@context': 'https://w3id.org/security/suites/ed25519-2020/v1',
        id:
          this.didDocument.id.split('#')[0] +
          '#' +
          this.vaultWallet.keys.publicKeyMultibase,
        controller: this.didDocument.id,
        publicKeyMultibase: this.vaultWallet.keys.publicKeyMultibase,
      };
      const ed25519 = await Ed25519VerificationKey2020.from(authenticationKey);
      return ed25519;
    };

    this.authenticationKey = {
      '@context': 'https://w3id.org/security/suites/ed25519-2020/v1',
      id:
        this.didDocument.id.split('#')[0] +
        '#' +
        this.vaultWallet.keys.publicKeyMultibase,
      controller: this.didDocument.id,
      publicKeyMultibase: this.vaultWallet.keys.publicKeyMultibase,
      privateKeyMultibase: this.vaultWallet.keys.privateKeyMultibase,
    };
  }

  async initate(): Promise<IEdvClientManager> {
    const ed25519 = await Ed25519VerificationKey2020.from(
      this.authenticationKey,
    );
    const x25519 =
      await X25519KeyAgreementKey2020.fromEd25519VerificationKey2020({
        keyPair: {
          publicKeyMultibase: this.vaultWallet.keys.publicKeyMultibase,
          privateKeyMultibase: this.vaultWallet.keys.privateKeyMultibase,
        },
      });
    x25519.id =
      this.didDocument.id.split('#')[0] + '#' + x25519.publicKeyMultibase;

    const keyAgreementKey = {
      id: this.didDocument.id.split('#')[0] + '#' + x25519.publicKeyMultibase,
      type: 'X25519KeyAgreementKey2020',
    };

    this.recipient = [
      {
        ...keyAgreementKey,
        publicKeyMultibase: x25519.publicKeyMultibase,
      },
    ];

    this.vault = new HypersignEdvClientEd25519VerificationKey2020({
      keyResolver: this.keyResolver,
      url: process.vaultUrl,
      ed25519VerificationKey2020: ed25519,
      x25519KeyAgreementKey2020: x25519,
    });

    const config = {
      url: process.vaultUrl,
      keyAgreementKey,
      controller: this.authenticationKey.id,
      edvId: this.edvId
        ? this.edvId
        : 'urn:uuid:6e8bc430-9c3a-11d9-9669-0800200c9a66',
    };

    const res = await this.vault.registerEdv(config);
    return this;
  }

  prepareEdvDocument(
    content: object,
    indexes: Array<{ index: string; unique: boolean }>,
    recipients?: Array<IEncryptionRecipents>,
  ): EDVDocType {
    const document: any = {
      document: { content },
      edvId: this.edvId,
      indexs: indexes,
      recipients: recipients ? recipients : this.recipient,
    };
    return document;
  }

  async insertDocument(doc: EDVDocType): Promise<{ id: string }> {
    if (doc['recipients'] && doc['recipients'].length !== 0) {
      doc['recipients'].push(this.recipient[0]);
    } else {
      doc['recipients'] = this.recipient;
    }
    const resp: IResponse = await this.vault.insertDoc({ ...doc });

    return {
      id: resp.document.id,
    };
  }

  updateDocument(): any {
    throw new Error('not implemented');
  }
  deleteDocument(): any {
    throw new Error('not implemented');
  }
}
