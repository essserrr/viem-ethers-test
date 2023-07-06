import { ethers, Overrides, Signer } from "ethers";

import { MULTICALL_ADDRESS } from "../config";
import { Multicall2, Multicall2__factory } from "../types/MultiCall.sol";

export interface CallData<T extends ethers.Interface> {
  method: Parameters<T["getFunction"]>[0];
  params?: any;
}

export interface MCall<T extends ethers.Interface> {
  address: string;
  interface: T;
  method: Parameters<T["getFunction"]>[0];
  params?: any;
}

export async function multicall<R extends Array<any>>(
  calls: Array<MCall<any>>,
  p: Signer | ethers.Provider,
  overrides?: Overrides,
): Promise<R> {
  const multiCallContract = Multicall2__factory.connect(MULTICALL_ADDRESS, p);

  const { returnData } = await multiCallContract.aggregate.staticCall(
    calls.map(c => ({
      target: c.address,
      callData: c.interface.encodeFunctionData(c.method as string, c.params),
    })),
    overrides || {},
  );

  return returnData
    .map((d, num) =>
      calls[num].interface.decodeFunctionResult(calls[num].method as string, d),
    )
    .map(r => (Array.isArray(r) && r.length <= 1 ? r[0] : r)) as R;
}

export class MultiCallContract<T extends ethers.Interface> {
  private readonly _address: string;

  private readonly _interface: T;

  protected _multiCall: Multicall2;

  constructor(
    address: string,
    intrerface: T,
    provider: ethers.Provider | Signer,
  ) {
    this._address = address;
    this._interface = intrerface;

    this._multiCall = Multicall2__factory.connect(MULTICALL_ADDRESS, provider);
  }

  async call<R extends Array<any>>(
    data: Array<CallData<T>>,
    overrides?: Overrides,
  ): Promise<R> {
    const { returnData } = await this._multiCall.aggregate.staticCall(
      data.map(c => ({
        target: this._address,
        callData: this._interface.encodeFunctionData(
          c.method as string,
          c.params,
        ),
      })),
      overrides || {},
    );

    return returnData
      .map((d, num) =>
        this._interface.decodeFunctionResult(data[num].method as string, d),
      )
      .map(r => r[0]) as R;
  }

  get address(): string {
    return this._address;
  }

  get interface(): T {
    return this._interface;
  }
}
