import { App } from "../core/app";
import { Test } from "../core/test";

const CALLS = 20;

export const providerCallsTest = (app: App) => async () => {
  app.logger.debug("Provider calls ethers 6 vs viem test");

  app.logger.debug("\n");
  app.logger.debug("getBlockNumber");
  app.logger.debug("ethers 6");
  await Test.measure(app)(async () => {
    const x = await app.provider.getBlockNumber();
  }, CALLS);
  app.logger.debug("viem");
  await Test.measure(app)(async () => {
    const x = await app.publicClient.getBlockNumber();
  }, CALLS);

  app.logger.debug("\n");
  app.logger.debug("getGasPrice");
  app.logger.debug("ethers 6");
  await Test.measure(app)(async () => {
    const x = await app.provider.getFeeData();
  }, CALLS);
  app.logger.debug("viem");
  await Test.measure(app)(async () => {
    const x = await app.publicClient.getGasPrice();
  }, CALLS);
};
