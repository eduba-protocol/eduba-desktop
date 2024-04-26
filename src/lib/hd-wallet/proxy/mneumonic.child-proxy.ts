import { proxyInstanceToParent } from "../../node-fork/child";
import { MneumonicHdWalletCore } from "../core/mneumonic.hd-wallet.core";

proxyInstanceToParent<MneumonicHdWalletCore>(new MneumonicHdWalletCore());