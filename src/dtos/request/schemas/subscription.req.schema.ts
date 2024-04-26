import {
    object,
    string,
    pattern,
  } from "superstruct";
import { dbIdRegex } from "../../../main/models/entity.model";

export const CreateSubscriptionRequestSchema = object({
    _id: pattern(string(), dbIdRegex),
});
