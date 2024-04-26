import { inject, injectable } from "inversify";
import { createHash } from "crypto";
import z32 from "z32";
import ElectronStore from "electron-store";
import { Session } from "../store-keys";
import * as Constants from "../../constants";
import { SessionStatus } from "../../enums";
import { TYPES } from "../di/types";
import { HyperbeeService, HyperdriveService } from "@/lib/holepunch";
import { Emitter } from "@/lib/emitter";
import log, { LogFunctions } from "electron-log";
import { AuthRequest } from "@/dtos/request/interfaces";
import Corestore from "corestore";
import { HdWallet } from "@/lib/hd-wallet";
import { SessionStatusChangeEvent } from "@/events/common/main";

type Corestore = typeof Corestore;

@injectable()
export class UserService {
  private readonly log: LogFunctions = log.scope("UserService");

  private _sessionDbId: string | undefined;

  private _sessionStore: Corestore | undefined;

  constructor(
    @inject(TYPES.ElectronStore) private store: ElectronStore,
    @inject(TYPES.Corestore) private readonly corestore: Corestore,
    @inject(TYPES.HyperdriveService) private readonly driveService: HyperdriveService,
    @inject(TYPES.HyperbeeService) private readonly beeService: HyperbeeService,
    @inject(TYPES.Events) private readonly events: Emitter
  ) {}

  get sessionStore() {
    return this._sessionStore;
  }

  sessionDbId(require = true) {
    if (!this._sessionDbId && require) {
      throw new Error("No active session");
    }
    return this._sessionDbId;
  }

  async resumeExistingSession() {
      const primaryKey = await this.store.get(Session);

      if (primaryKey) {
        await this.startSession(z32.decode(primaryKey));
      }
  }

  sessionStatus() {
    return {
      status: this._sessionDbId ? SessionStatus.Active : SessionStatus.Inactive,
    };
  }
  
  async generateMneumonic() {
    const wallet = HdWallet.mneumonicWallet();
    const result = await wallet.generateMneumonic();
    return result;
  }

  async getHdWalletAddress({ walletType, ...params }: AuthRequest) {
    const hdWallet = HdWallet.walletForType(walletType);
    const result = await hdWallet.addressForPath(params);
    return result;
  }

  async signIn({ walletType, ...params }: AuthRequest) {
    const hdWallet = HdWallet.walletForType(walletType);

    const message = "Eduba Sign In";
    const signedMessage = await hdWallet.signMessage({ ...params, message });

    const hash = createHash("sha256");
    hash.update(signedMessage);
    const primaryKey = hash.digest();

    await this.startSession(primaryKey);

    return this.sessionStatus();
  }

  async signOut() {
    this._sessionDbId = void 0;

    await Promise.all([
      this.driveService.endSession(),
      this.beeService.endSession(),
      this.store.delete(Constants.Session),
    ]);

    this.log.debug("session ended");

    this.events.dispatch(new SessionStatusChangeEvent(SessionStatus.Inactive));

    return this.sessionStatus();
  }

  async startSession(primaryKey: Buffer) {
    this._sessionStore = this.corestore.session({ primaryKey });

    this.driveService.startSession(this._sessionStore);
    this.beeService.startSession(this._sessionStore);

    await this.store.set(Constants.Session, z32.encode(primaryKey));

    const userBee = await this.beeService.db({ name: Constants.User });
    await userBee.ready();

    this._sessionDbId = userBee.id;

    this.events.dispatch(new SessionStatusChangeEvent(SessionStatus.Active));
  }
}
