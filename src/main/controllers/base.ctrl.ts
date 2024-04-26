import { inject, injectable } from "inversify";
import { UserService } from "../services";
import { SessionStatus } from "@/enums";
import { TYPES } from "../di/types";

@injectable()
export class BaseController {
    @inject(TYPES.UserService) protected readonly userService: UserService;

    sessionGuard() {
        const { status } = this.userService.sessionStatus();
        if (status !== SessionStatus.Active) {
            throw new Error("Unauthorized.  No active session.");
        }
    }
}