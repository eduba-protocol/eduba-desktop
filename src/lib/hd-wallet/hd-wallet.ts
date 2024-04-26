import { join } from "path";
import { forkModule } from "../node-fork/parent";
import { LedgerHdWalletBase } from "./base/ledger.hd-wallet.base";
import { MneumonicHdWalletBase } from "./base/mneumonic.hd-wallet.base";
import { HdWalletType } from "@/enums";
import { HdWalletBase } from "./base/hd-wallet.base";

export class HdWallet {
    static mneumonicWallet() {
        return forkModule<MneumonicHdWalletBase>(
            new MneumonicHdWalletBase(),
            // filepath in the compiled webpack code
            join(__dirname, "./mneumonicWallet.js")
        )
    }

    static ledgerWallet() {
        return forkModule<LedgerHdWalletBase>(
            new LedgerHdWalletBase(),
            // filepath in the compiled webpack code
            join(__dirname, "./ledgerWallet.js")
        );
    }

    static walletForType(type: HdWalletType): HdWalletBase {
        switch(type) {
            case HdWalletType.Mneumonic: return this.mneumonicWallet();
            case HdWalletType.Ledger: return this.ledgerWallet();
            default:
                throw new Error(`Unsupported wallet type: ${type}`);
        }
    }
}