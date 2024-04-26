import { generateMnemonic, validateMnemonic, mnemonicToSeedSync } from "bip39";
import ecc from '@bitcoinerlab/secp256k1';
import { BIP32Factory } from "bip32";
import { MneumonicHdWalletParams, MneumonicHdWalletSignMessageParams } from "../types";
import { MneumonicHdWalletBase } from "../base/mneumonic.hd-wallet.base";

const bip32 = BIP32Factory(ecc);

export class MneumonicHdWalletCore extends MneumonicHdWalletBase {
  public async generateMneumonic() {
    return generateMnemonic();
  }

  public async addressForPath({ phrase, password = "", bip44Params }: MneumonicHdWalletParams): Promise<string> {
    if (!validateMnemonic(phrase)) {
      throw new Error("Recovery phrase is invalid");
    }

    switch (bip44Params.chain) {
      case 0: {
        const bitcoin = await import("bitcoinjs-lib");

        const seed = mnemonicToSeedSync(phrase);
        const root = bip32.fromSeed(seed);
        const node = root.derivePath(this.buildPath(bip44Params));

        const address = bitcoin.payments.p2pkh({
          pubkey: node.publicKey,
        }).address;

        return address;
      }
      case 60: {
        const { HDNodeWallet } = await import("ethers");
        const wallet = HDNodeWallet.fromPhrase(
          phrase,
          password,
          this.buildPath(bip44Params)
        );
        return wallet.address;
      }
      default:
        throw new Error(`Unsupported chain ${bip44Params.chain}`);
    }
  }

  public async signMessage(
    { phrase, password = "", message, bip44Params }: MneumonicHdWalletSignMessageParams
  ): Promise<string> {
    if (!validateMnemonic(phrase)) {
      throw new Error("Recovery phrase is invalid");
    }

    switch (bip44Params.chain) {
      case 0: {
        const bitcoinMessage = await import("bitcoinjs-message");

        const seed = mnemonicToSeedSync(phrase);
        const root = bip32.fromSeed(seed);
        const node = root.derivePath(this.buildPath(bip44Params));

        const signature = bitcoinMessage.sign(message, node.privateKey);
        return signature.toString("base64");
      }
      case 60: {
        const { HDNodeWallet } = await import("ethers");
        const wallet = HDNodeWallet.fromPhrase(
          phrase,
          password,
          this.buildPath(bip44Params)
        );
        return (await wallet.signMessage(message)).slice("0x".length);
      }
      default:
        throw new Error(`Unsupported chain ${bip44Params.chain}`);
    }
  }
}
