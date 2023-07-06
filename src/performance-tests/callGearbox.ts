import { encodeFunctionData, getContract } from "viem";

import { ADDRESS_PROVIDER, MULTICALL_ADDRESS } from "../config";
import { App } from "../core/app";
import { MultiCallContract } from "../core/multicall";
import { Test } from "../core/test";
import { IAddressProvider__factory } from "../types/IAddressProvider.sol";
import { Multicall2__factory } from "../types/MultiCall.sol";

const CALLS = 20;

export const callGearboxTest = (app: App) => async () => {
  app.logger.debug("Gearbox calls ethers 6 vs viem test");

  app.logger.debug("\n");
  app.logger.debug("Single call AddressProvider.getLeveragedActions()");
  app.logger.debug("ethers 6");
  await Test.measure(app)(async () => {
    const contract = IAddressProvider__factory.connect(
      ADDRESS_PROVIDER,
      app.provider,
    );
    const x = await contract.getLeveragedActions();
  }, CALLS);
  app.logger.debug("viem");
  await Test.measure(app)(async () => {
    const contract = getContract({
      address: ADDRESS_PROVIDER,
      abi: IAddressProvider__factory.abi,
      publicClient: app.publicClient,
    });
    const x = await contract.read.getLeveragedActions();
  }, CALLS);
  app.logger.debug("BONUS ethers 6 + gearbox multicall for a single call");
  await Test.measure(app)(async () => {
    const multicall = new MultiCallContract(
      ADDRESS_PROVIDER,
      IAddressProvider__factory.createInterface(),
      app.provider,
    );
    const x = await multicall.call([
      {
        method: "getLeveragedActions",
      },
    ]);
  }, CALLS);

  app.logger.debug("\n");
  app.logger.debug(
    "Multicall to address provider (with contract instance creation)",
  );
  app.logger.debug("ethers 6 + gearbox multicalls");
  await Test.measure(app)(async () => {
    const multicall = new MultiCallContract(
      ADDRESS_PROVIDER,
      IAddressProvider__factory.createInterface(),
      app.provider,
    );
    const x = await multicall.call([
      {
        method: "getDataCompressor",
      },
      {
        method: "getGearToken",
      },
      {
        method: "getWethToken",
      },
      {
        method: "getLeveragedActions",
      },
      {
        method: "getPriceOracle",
      },
    ]);
  }, CALLS);
  app.logger.debug("viem");
  await Test.measure(app)(async () => {
    const contract = {
      address: ADDRESS_PROVIDER,
      abi: IAddressProvider__factory.abi,
    } as const;

    const x = await app.publicClient.multicall({
      contracts: [
        {
          ...contract,
          functionName: "getDataCompressor",
        },
        {
          ...contract,
          functionName: "getGearToken",
        },
        {
          ...contract,
          functionName: "getWethToken",
        },

        {
          ...contract,
          functionName: "getLeveragedActions",
        },
        {
          ...contract,
          functionName: "getPriceOracle",
        },
      ],
    });
  }, CALLS);
  app.logger.debug("viem + gearbox multicalls");
  await Test.measure(app)(async () => {
    const multicall = getContract({
      address: MULTICALL_ADDRESS,
      abi: Multicall2__factory.abi,
      publicClient: app.publicClient,
    });

    const calls = [
      {
        target: ADDRESS_PROVIDER,
        callData: encodeFunctionData({
          abi: IAddressProvider__factory.abi,
          functionName: "getDataCompressor",
        }),
      },
      {
        target: ADDRESS_PROVIDER,
        callData: encodeFunctionData({
          abi: IAddressProvider__factory.abi,
          functionName: "getGearToken",
        }),
      },
      {
        target: ADDRESS_PROVIDER,
        callData: encodeFunctionData({
          abi: IAddressProvider__factory.abi,
          functionName: "getWethToken",
        }),
      },

      {
        target: ADDRESS_PROVIDER,
        callData: encodeFunctionData({
          abi: IAddressProvider__factory.abi,
          functionName: "getLeveragedActions",
        }),
      },
      {
        target: ADDRESS_PROVIDER,
        callData: encodeFunctionData({
          abi: IAddressProvider__factory.abi,
          functionName: "getPriceOracle",
        }),
      },
    ];

    const x = await multicall.simulate.aggregate([calls as any]);
  }, CALLS);

  app.logger.debug("BONUS Promise.all");
  app.logger.debug("ethers 6");
  await Test.measure(app)(async () => {
    const contract = IAddressProvider__factory.connect(
      ADDRESS_PROVIDER,
      app.provider,
    );
    const x = await Promise.all([
      contract.getDataCompressor(),
      contract.getGearToken(),
      contract.getWethToken(),
      contract.getLeveragedActions(),
      contract.getPriceOracle(),
    ]);
  }, CALLS);
  app.logger.debug("viem");
  await Test.measure(app)(async () => {
    const contract = getContract({
      address: ADDRESS_PROVIDER,
      abi: IAddressProvider__factory.abi,
      publicClient: app.publicClient,
    });
    const x = await Promise.all([
      contract.read.getDataCompressor(),
      contract.read.getGearToken(),
      contract.read.getWethToken(),
      contract.read.getLeveragedActions(),
      contract.read.getPriceOracle(),
    ]);
  }, CALLS);
};
