import { ChildMessage, ParentMessage } from "./types";

export function proxyInstanceToParent<T>(libInstance: T) {
  process.on("message", async ({ key, args }: ParentMessage<T>) => {
      let message: ChildMessage;

      try {
        let result: unknown = libInstance[key];

        if (typeof result === "function") {
          result = await (result as (...args: unknown[]) => unknown).apply(libInstance, args)
        }
        
        message = { ok: true, result };
      } catch (err) {
        message = { ok: false, error: err.toString() };
      }

      process.send(message);
  });
}
