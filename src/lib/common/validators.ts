import { define } from "superstruct"

export function isoString() {
    return define(
        'isoString',
        (val) => val && typeof val === "string" && val === new Date(val).toISOString()
    );
}