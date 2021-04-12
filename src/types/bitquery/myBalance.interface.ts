import { BigNumber } from "@0x/utils";
import { Currency } from "./currency.interface";

export interface MyBalance {

  currency: Currency;
  
  value: number;

  valueUsd?: number;

} 