import { App } from "./app";

type Callback = (() => Promise<void>) | (() => void);

export class Test {
  static measure =
    (app: App) =>
    async (f: Callback, times = 1000) => {
      const start = performance.now();
      for (let i = 0; i < times; i++) {
        await f();
      }
      const end = performance.now();
      const total = end - start;
      const speed = total / times;
      app.logger.debug(`Total time: ${total}, per iteration: ${speed}`);
    };
}
