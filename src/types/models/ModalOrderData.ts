import BigNumber from "bignumber.js";
import {Token} from "types/app";

export interface ModalOrderData {

  isMarket: boolean;

  account: string;

  allowanceTarget: string;

  tokenFrom: Token;

  tokenTo: Token;

  amountFrom: number;

  amountTo: number;

  price: number;

  expiry: number

}