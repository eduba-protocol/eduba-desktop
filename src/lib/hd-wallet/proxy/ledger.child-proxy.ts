import { LedgerHdWalletCore } from "../core/ledger.hd-wallet.core";
import { proxyInstanceToParent } from "../../node-fork/child";

proxyInstanceToParent<LedgerHdWalletCore>(new LedgerHdWalletCore());