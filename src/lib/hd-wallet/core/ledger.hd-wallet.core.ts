import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import { listen } from "@ledgerhq/logs";
import { HdWalletParams, HdWalletSignMessageParams } from "../types";
import { LedgerHdWalletBase } from "../base/ledger.hd-wallet.base";

export class LedgerHdWalletCore extends LedgerHdWalletBase {
  public async addressForPath({ bip44Params }: HdWalletParams): Promise<string> {
    const path = this.buildPath(bip44Params);
    const transport = await TransportNodeHid.open("");

    listen((log) => console.log(log));

    try {
      const ledgerApp = await this.chainApp(bip44Params.chain, transport);
      let address;

      switch (bip44Params.chain) {
        case 0: {
          const result = await ledgerApp.getWalletPublicKey(path, {
            verify: false,
            format: "legacy",
          });
          address = result.bitcoinAddress;
          break;
        }
        case 60: {
          ({ address } = await ledgerApp.getAddress(path));
          break;
        }
      }

      await transport.close().catch((err) => console.error(err));

      return address;
    } catch (err) {
      await transport.close().catch((err) => console.error(err));
      throw err;
    }
  }

  public async signMessage({ message, bip44Params }: HdWalletSignMessageParams): Promise<string> {
    const path = this.buildPath(bip44Params);
    const messageHex = Buffer.from(message).toString("hex");
    const transport = await TransportNodeHid.open("");
    listen((log) => console.log(log));

    try {
      const ledgerApp = await this.chainApp(bip44Params.chain, transport);
      let signedMessage;

      switch (bip44Params.chain) {
        case 0: {
          const result = await ledgerApp.signMessage(path, messageHex);
          signedMessage = `${result.r}${result.s}${result.v}`;
          break;
        }
        case 60: {
          const result = await ledgerApp.signPersonalMessage(path, messageHex);
          signedMessage = `${result.r}${result.s}${result.v}`;
          break;
        }
      }

      await transport.close().catch((err) => console.error(err));

      return signedMessage;
    } catch (err) {
      await transport.close().catch((err) => console.error(err));
      throw err;
    }
  }

  private async chainApp(chain: number, transport: TransportNodeHid): Promise<any> {
    switch (chain) {
      case 0: {
        const BtcApp = (await import("@ledgerhq/hw-app-btc")).default;
        return new BtcApp({ transport });
      }
      case 60: {
        const EthApp = (await import("@ledgerhq/hw-app-eth")).default;
        return new EthApp(transport);
      }
      default:
        throw new Error(`Unsupported blockchain ${chain}`);
    }
  }
}
