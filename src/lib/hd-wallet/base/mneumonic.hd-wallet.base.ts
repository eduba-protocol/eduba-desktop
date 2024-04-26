import { HdWalletParams, HdWalletSignMessageParams } from "../types";
import { HdWalletBase } from "./hd-wallet.base";

export class MneumonicHdWalletBase extends HdWalletBase {
  public addressForPath(_request: HdWalletParams): Promise<string>{
    throw new Error("Not Implemented");
  }

  public signMessage(_request: HdWalletSignMessageParams): Promise<string> {
      throw new Error("Not Implemented");
  }

  public generateMneumonic(): Promise<string> {
    throw new Error("Not Implemented");
  }
}
