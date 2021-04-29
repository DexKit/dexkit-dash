import { Currency } from "./currency.interface";

export interface MyBalance {

  currency: Currency;
  
  value: number;

  valueUsd?: number;

  history?: {timestamp: Date, value: number}[] | {[key: string]: number};

} 