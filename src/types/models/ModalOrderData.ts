import BigNumber from "bignumber.js";
import {Token} from "types/app";

export interface ModalOrderData {

  isMarket: boolean;

  amount: BigNumber;

  token0: Token;

  token1: Token;

  account: string;

  allowanceTarget: string;

  price: number;

}