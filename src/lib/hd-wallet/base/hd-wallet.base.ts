import { Bip44Params, HdWalletParams, HdWalletSignMessageParams } from "../types";

export abstract class HdWalletBase {
  public abstract addressForPath(request: HdWalletParams): Promise<string>;

  public abstract signMessage(request: HdWalletSignMessageParams): Promise<string>;

  protected buildPath({ chain = 0, account = 0, change = 0, index = 0 }: Bip44Params): string {
    return `m/44'/${chain}'/${account}'/${change}/${index}`;
  }
}
