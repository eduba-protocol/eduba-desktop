import { AuthRequest } from "@/dtos/request/interfaces";
import { SessionStatusDto } from "@/dtos/response/interfaces";

export interface AuthApi {
  sessionStatus(): Promise<SessionStatusDto>;

  signIn(req: AuthRequest): Promise<SessionStatusDto>;

  signOut(): Promise<SessionStatusDto>;

  generateMneumonic(): Promise<string>;

  getHdWalletAddress(req: AuthRequest): Promise<string>;
}

