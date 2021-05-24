import { MyBalance } from "./myBalance.interface";

export interface BitqueryAddress {

	balances: MyBalance[];

	date?: Date;

}