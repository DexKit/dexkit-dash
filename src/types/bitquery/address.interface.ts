import { Currency } from "./currency.interface";
import { MyBalance } from "./myBalance.interface";

export interface BitqueryAddress {
	balances: Currency[] | MyBalance[];
	date?: Date
}