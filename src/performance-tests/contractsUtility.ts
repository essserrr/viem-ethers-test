import { encodeFunctionData, encodeFunctionResult, getContract } from "viem";

import { DATA_COMPRESSOR } from "../config";
import { App } from "../core/app";
import { Test } from "../core/test";
import { IDataCompressor__factory } from "../types/IDataCompressor.sol";

const RANDOM_ADDRESS = "0x55d59b791f06dc519B176791c4E037E8Cf2f6361";

export const contractUtility = (app: App) => async () => {
  app.logger.debug("Contracts utility ethers 6 vs viem test");

  app.logger.debug("\n");
  app.logger.debug("Contract instance creation");
  app.logger.debug("ethers 6");
  await Test.measure(app)(() => {
    const x = IDataCompressor__factory.connect(DATA_COMPRESSOR, app.provider);
  });
  app.logger.debug("viem");
  await Test.measure(app)(() => {
    const x = getContract({
      address: DATA_COMPRESSOR,
      abi: IDataCompressor__factory.abi,
      publicClient: app.publicClient,
    });
  });

  app.logger.debug("\n");
  app.logger.debug("encodeFunctionData");
  app.logger.debug("ethers 6");
  const contractEthers = IDataCompressor__factory.connect(
    DATA_COMPRESSOR,
    app.provider,
  );
  await Test.measure(app)(() => {
    const data = contractEthers.interface.encodeFunctionData("getAdapter", [
      RANDOM_ADDRESS,
      RANDOM_ADDRESS,
    ]);
  });
  app.logger.debug("viem");
  await Test.measure(app)(() => {
    const data = encodeFunctionData({
      abi: IDataCompressor__factory.abi,
      functionName: "getAdapter",
      args: [RANDOM_ADDRESS, RANDOM_ADDRESS],
    });
  });

  app.logger.debug("\n");
  app.logger.debug("encodeFunctionResult");
  app.logger.debug("ethers 6");
  await Test.measure(app)(() => {
    const resEthers = contractEthers.interface.encodeFunctionResult(
      "getAdapter",
      [RANDOM_ADDRESS],
    );
  });
  app.logger.debug("viem");
  await Test.measure(app)(() => {
    const resViem = encodeFunctionResult({
      abi: IDataCompressor__factory.abi,
      functionName: "getAdapter",
      result: RANDOM_ADDRESS,
    });
  });
};
