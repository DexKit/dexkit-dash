import { NETWORK } from "shared/constants/AppEnums";
import { MintBurn } from "types/app";

export function parseMintBurnData(data: any, address: string|null, network: NETWORK): { mint: MintBurn[], burn: MintBurn[] } {

  if (data && data.data[network]) {
    const mint: MintBurn[] = data.data[network].mint.map((e: any) => {
      return {
        hash: e.transaction.hash,
        block: e.block.height,
        type: 'Add',
        time: e.block.timestamp.time,
        amount0: 0,
        amount: 0,
        reserve0: 0,
        reserve1: 0
      }
    });

    const burn: MintBurn[] = data.data[network].burn.map((e: any) => {
      return {
        hash: e.transaction.hash,
        block: e.block.height,
        type: 'Remove',
        time: e.block.timestamp.time,
        amount0: 0,
        amount: 0,
        reserve0: 0,
        reserve1: 0
      }
    });
    
    return {mint, burn}
  }

  return {mint: [], burn: []}
}