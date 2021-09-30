import { BigNumber } from "@ethersproject/bignumber";
import { ChainId } from "types/blockchain";

export interface Drop{
    name: string,
    symbol: string,
    imageURL: string,
    description: string,
    address: string,
    chainId: ChainId,
    price: BigNumber,
    startDate: number;
    earlyAccessDate?: number;
    baseURI?: string,

}