import { signalState } from "@/lib/signal-state";
import { FormController } from "@/renderer/controllers/form.ctrl";
import { effect } from "@preact/signals";
import { HdWalletType } from "@/enums";
import { inject, injectable } from "inversify";
import { AppStore } from "@/renderer/stores";
import { TYPES } from "@/renderer/di";
import { IpcApi } from "@/api/ipc/types";
import { ComponentController } from "@/renderer/controllers/component.ctrl";

export interface AuthControllerState {
  modal: boolean;
  address: string;
  error: string;
  prompt: string;
}

export interface AuthFormState {
    walletType: HdWalletType;
    phrase: string;
    password: string;
    chain: string;
    account: number;
    change: number;
    index: number;
}

@injectable()
export class AuthController extends ComponentController<never>{
  public state = signalState<AuthControllerState>({
    modal: false,
    address: "",
    error: "",
    prompt: ""
  });

  public form: FormController<AuthFormState>;

  constructor(
    @inject(AppStore) private readonly appStore: AppStore,
    @inject(TYPES.IpcSdk) private readonly ipcSdk: IpcApi
  ) {
    super();

    this.form = new FormController<AuthFormState>(
      this.handleSubmit,
      signalState({
        walletType: HdWalletType.Mneumonic,
        phrase: "",
        password: "",
        chain: "60", // Ethereum default chain
        account: 0,
        change: 0,
        index: 0,
      })
    );

    this.listeners = [
      effect(() => {
        this.refreshAddress(this.form.state.value);
      }),
    ];
  }

  async refreshAddress(data: AuthFormState) {
    if (data.walletType === HdWalletType.Mneumonic) {
      if (!data.phrase) return;

      const split = data.phrase.split(" ");
      if (!(split.length >= 12)) return;
    }

    try {
      const request = {
        walletType: data.walletType,
        phrase: data.phrase,
        password: data.password,
        bip44Params: {
          chain: parseInt(data.chain),
          account: data.account,
          change: data.change,
          index: data.index
        }
      };

      const address = await this.ipcSdk.auth.getHdWalletAddress(request);
      this.state._set({ address });
    } catch(err) {
      console.log(err);
      // Ignore get-address errors for ledger, since user most likely doesn't
      // have device app open.
      if (this.form.state.walletType.peek() === HdWalletType.Mneumonic) {
        this.state._set({ error: err.message });
      }
    }
  }

  generateMneumonic = async () => {
    const phrase = await this.ipcSdk.auth.generateMneumonic();
    this.form.state._set({ phrase });
  };

  handleSubmit = async (data: AuthFormState) => {
    this.state._set({ error: "" });

    try {
      const request = {
        walletType: data.walletType,
        phrase: data.phrase,
        password: data.password,
        bip44Params: {
          chain: parseInt(data.chain),
          account: data.account,
          change: data.change,
          index: data.index
        }
      };

      if (data.walletType === HdWalletType.Ledger) {
        const prompt = "Sign message on your device";
        this.state._set({ prompt });
      }

      await this.ipcSdk.auth.signIn(request);

      this.closeModal();
    } catch (err) {
      let msg = "Failed to login.";

      if (data.walletType === HdWalletType.Ledger) {
        msg += " Make sure your device is unlocked and opened to the app for the selected blockchain."
      }

      this.state._set({ error: msg });

      this.appStore.reportError(err);
    } finally {
      this.state._set({ prompt: "" });
    }
  };

  closeModal = () => {
    this.state._reset();
    this.form.state._reset();
  };

  openModal = () => {
    this.state._set({ modal: true });
  };
}
