import { fork } from "child_process";
import { ParentMessage, ChildMessage } from "./types";

export function forkModule<T extends object>(instance: T, modulePath: string): T {
  return new Proxy<T>(
    instance,
    {
      get(target: T, key: string) {
        const isFunction = typeof instance[key as keyof T] === "function";

        const callChild = (args?: unknown[]) => new Promise((resolve ,reject) => {
          const n = fork(modulePath);

          n.on("message", ({ ok, error, result }: ChildMessage) => {
            if (ok) {
              resolve(result);
            } else {
              reject(new Error(error));
            }
            n.kill();
          });

          n.on("error", (err) => {
            reject(err);
            n.kill();
          });

          const message: ParentMessage<T> = { key: key as keyof T, args };

          n.send(message);
        });

        const result = isFunction
          ? (...args: unknown[]) => callChild(args)
          : callChild();

        return result;
      },
    }
  );
}
