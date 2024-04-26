export interface Bip44Params {
    chain: number;
    account: number;
    change: number;
    index: number;
}

export interface HdWalletParams {
    bip44Params: Bip44Params;
}

export interface MneumonicHdWalletParams extends HdWalletParams {
    phrase: string;
    password?: string;
}

export interface SignMessageParams {
    message: string;
}

export type HdWalletSignMessageParams = HdWalletParams & SignMessageParams;

export type MneumonicHdWalletSignMessageParams = MneumonicHdWalletParams & SignMessageParams;