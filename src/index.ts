import * as dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";
(global as any).fetch = fetch;

import { PROVIDER_ADDRESS } from "./config";
import { App } from "./core/app";
import { bnTest } from "./performance-tests/bigNumberVsBigInt";
import { callGearboxTest } from "./performance-tests/callGearbox";
import { contractUtility } from "./performance-tests/contractsUtility";
import { providerCallsTest } from "./performance-tests/providerCalls";

async function main() {
  const app = App.init({ url: PROVIDER_ADDRESS });
  app.logger.debug("App initialized with provider address: ", PROVIDER_ADDRESS);

  await bnTest(app)();

  await contractUtility(app)();

  await providerCallsTest(app)();

  await callGearboxTest(app)();
}

main().catch(error => {
  console.error(error);
  process.exitCode = 0;
});
