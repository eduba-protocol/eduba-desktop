import { DbChangeType } from "../enums";

export class DbChangeEvent {
    static eventName = "DbChangeEvent";
    
    type: DbChangeType;
    db: string;
    key: string;
    version: number;
    previousVersion: number;

    constructor(init: DbChangeEvent) {
        Object.assign(this, init);
    }
}
