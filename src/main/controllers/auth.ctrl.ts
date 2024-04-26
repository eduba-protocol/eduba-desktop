import { injectable } from "inversify";
import { schema, validate } from "./common/decorators";
import { AuthRequest } from "@/dtos/request/interfaces";
import { AuthApi } from "@/api/interfaces/auth.api";
import { AuthRequestSchema } from "@/dtos/request/schemas";
import { BaseController } from "./base.ctrl";

@injectable()
export class AuthController extends BaseController implements AuthApi {
  constructor() {
    super();
  }

  async sessionStatus() {
    return this.userService.sessionStatus();
  }

  @validate
  async signIn(
    @schema(AuthRequestSchema) req: AuthRequest
  ) {
    return this.userService.signIn(req);
  }

  async signOut() {
    this.sessionGuard();
    return this.userService.signOut();
  }

  async generateMneumonic() {
    return this.userService.generateMneumonic();
  }

  @validate
  async getHdWalletAddress(
    @schema(AuthRequestSchema) req: AuthRequest
  ) {
    return this.userService.getHdWalletAddress(req);
  }
}

