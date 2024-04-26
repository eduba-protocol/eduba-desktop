import { AuthRequest } from "@/dtos/request/interfaces";
import { SessionStatusDto } from "@/dtos/response/interfaces";
import { AuthApi } from "../interfaces/auth.api";
import { IpcSdkBase } from "./base.ipc.sdk";

export class AuthIpcSdk extends IpcSdkBase implements AuthApi {
  sessionStatus = (): Promise<SessionStatusDto> => {
    return this.invoke("auth.sessionStatus");
  }

  signIn = (req: AuthRequest): Promise<SessionStatusDto> => {
    return this.invoke("auth.signIn", req);
  }

  signOut = (): Promise<SessionStatusDto> => {
    return this.invoke("auth.signOut");
  }

  generateMneumonic = (): Promise<string> => {
    return this.invoke("auth.generateMneumonic");
  }

  getHdWalletAddress = (req: AuthRequest): Promise<string> => {
    return this.invoke("auth.getHdWalletAddress", req);
  }
}