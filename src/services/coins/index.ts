import { BigNumber } from "@0x/utils";
import { Network } from "types/blockchain";
import BTCService from "./btc";


// Interface for UTXO based coins
export interface CoinInterface{
    precision: number;
    transfer: (from: string, amount: BigNumber, to: string) => void;
    getBalance: (address: string) => void;
    getAddress: (index: number) => string | boolean;
    getTransactions: (address: string) => any;
    getNetwork: () => Network;
    getPrivateKey: (index: number) => string | boolean;
    getPrivateKeyForAddress: (address: string) => string | boolean;
    setPrivateKey: (encryptedSeed: string, passphrase: string, index: number) => void;
    getPath: () => string;
    sendTx: (rawTx: string) => Promise<any>;
    fetchUnspent: (address: string) => any
}

export const COINS_SERVICE = {
    [Network.bitcoin]: BTCService
}

