import { HdWalletType } from "@/enums";

export interface Bip44Params {
    chain: number;
    account: number;
    change: number;
    index: number;
}

export interface AuthRequest {
    // Wallet type
    walletType: HdWalletType;
    // Mneumonic phrase
    phrase?: string;
    // Mneumonic phrase password
    password?: string;
    // BIP 44 params
    bip44Params: Bip44Params;
}

