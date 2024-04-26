import {
    object,
    optional,
    string,
    enums,
    number,
  } from "superstruct";
  import { HdWalletType } from "@/enums";

export const Bip44Params = object({
    chain: number(),
    account: number(),
    change: number(),
    index: number(),
});

export const AuthRequestSchema = object({
    walletType: enums(Object.values(HdWalletType)),
    phrase: optional(string()),
    password: optional(string()),
    bip44Params: Bip44Params,
});
