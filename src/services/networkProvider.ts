import { providers } from "ethers";



export const maticNetworkProvider = new providers.JsonRpcProvider('https://polygon-rpc.com/', 137);
export const mumbaiNetworkProvider = new providers.JsonRpcProvider('https://polygon-rpc.com/', 80001);
export const bscNetworkProvider = new providers.JsonRpcProvider('https://bsc-dataseed.binance.org/', 56);
export const ethereumNetworkProvider = new providers.JsonRpcProvider('https://eth-mainnet.alchemyapi.io/v2/flGT97cHvj0kkXk2-5AHHCC9AXJGlU7L');
export const ethereumRopstenNetworkProvider = new providers.JsonRpcProvider('https://eth-ropsten.alchemyapi.io/v2/aJ_98nQ0EEQ7iTnUFaT_vpuE5mxgYbRl');