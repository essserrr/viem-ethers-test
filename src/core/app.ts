import { ethers } from "ethers";
import { Logger } from "tslog";
import { createPublicClient, http, PublicClient } from "viem";
import { mainnet } from "viem/chains";

interface AppProps {
  url: string;
}

export class App {
  readonly provider: ethers.JsonRpcProvider;
  readonly publicClient: PublicClient;
  readonly logger: Logger;

  protected constructor(props: AppProps) {
    this.provider = new ethers.JsonRpcProvider(props.url);

    this.publicClient = createPublicClient({
      chain: mainnet,
      transport: http(props.url),
    });

    this.logger = new Logger({
      minLevel: "debug",
      displayFunctionName: false,
      displayLoggerName: false,
      displayFilePath: "hidden",
    });
  }

  static init(props: AppProps) {
    return new App(props);
  }
}
