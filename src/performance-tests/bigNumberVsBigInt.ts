import { BigNumber } from "@ethersproject/bignumber";

import { App } from "../core/app";
import { Test } from "../core/test";

const a = BigNumber.from("123456789");
const b = BigNumber.from("123456789");
const p = BigNumber.from("456");

const ai = BigInt("123456789");
const bi = BigInt("12345");
const pi = BigInt("456");

export const bnTest = (app: App) => async () => {
  app.logger.debug("BigNumber vs bigit test");

  app.logger.debug("\n");
  app.logger.debug("SUM");
  app.logger.debug("BigNumber");
  await Test.measure(app)(() => {
    const x = a.add(b);
  });
  app.logger.debug("BigInt");
  await Test.measure(app)(() => {
    const x = ai + bi;
  });

  app.logger.debug("\n");
  app.logger.debug("SUB");
  app.logger.debug("BigNumber");
  await Test.measure(app)(() => {
    const x = a.sub(b);
  });
  app.logger.debug("BigInt");
  await Test.measure(app)(() => {
    const x = ai - bi;
  });

  app.logger.debug("\n");
  app.logger.debug("DIV");
  app.logger.debug("BigNumber");
  await Test.measure(app)(() => {
    const x = a.div(b);
  });
  app.logger.debug("BigInt");
  await Test.measure(app)(() => {
    const x = ai / bi;
  });

  app.logger.debug("\n");
  app.logger.debug("POW");
  app.logger.debug("BigNumber");
  await Test.measure(app)(() => {
    const x = a.pow(p);
  });
  app.logger.debug("BigInt");
  await Test.measure(app)(() => {
    const x = ai ** pi;
  });

  app.logger.debug("\n");
  app.logger.debug("OR");
  app.logger.debug("BigNumber");
  await Test.measure(app)(() => {
    const x = a > b;
  });
  app.logger.debug("BigInt");
  await Test.measure(app)(() => {
    const x = ai > bi;
  });

  app.logger.debug("\n");
  app.logger.debug("GT");
  app.logger.debug("BigNumber");
  await Test.measure(app)(() => {
    const x = a.or(p);
  });
  app.logger.debug("BigInt");
  await Test.measure(app)(() => {
    const x = ai | pi;
  });
};
