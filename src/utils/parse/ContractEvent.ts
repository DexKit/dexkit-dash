import { toTokenUnitAmount } from "@0x/utils";
import { NETWORK } from "shared/constants/AppEnums";
import { MintBurn, OrderData } from "types/app";

function getVariation(isAdd: boolean, amount: number, reserve: number) {
  if (isAdd) {
    return ((100 * reserve) / (reserve - amount)) - 100;
  }
  return ((100 * reserve) / (reserve + amount)) - 100;
}

export function parseEventContractData(data: any, mint: MintBurn[], burn: MintBurn[], network: NETWORK, pair: OrderData) {

  if (data && data.data[network]) {
    const events = data.data[network].smartContractEvents;

    const mintEvents: any[] = events.filter((e: any) => e.smartContractEvent.name == "Mint")[0].arguments;
    const burnEvents: any[] = events.filter((e: any) => e.smartContractEvent.name == "Burn")[0].arguments;
    const reserveEvents: any[] = events.filter((e: any) => e.smartContractEvent.name == "Sync")[0].arguments;

    mint.map((e, index) => {
      e.amount0 = toTokenUnitAmount(mintEvents[(index*3)+1].value, pair.baseToken.decimals).toNumber();
      e.amount1 = toTokenUnitAmount(mintEvents[(index*3)+2].value, pair.quoteToken.decimals).toNumber();
      return e;
    });

    burn.map((e, index) => {
      e.amount0 = toTokenUnitAmount(burnEvents[(index*4)+1].value, pair.baseToken.decimals).toNumber();
      e.amount1 = toTokenUnitAmount(burnEvents[(index*4)+2].value, pair.quoteToken.decimals).toNumber();
      return e;
    });
    
    let all = mint.concat(burn).map((e, index) => {
      e.baseToken  = pair.baseToken;
      e.quoteToken = pair.quoteToken;
      e.reserve0 = toTokenUnitAmount(reserveEvents[(index*2)].value, pair.baseToken.decimals).toNumber();
      e.reserve1 = toTokenUnitAmount(reserveEvents[(index*2)+1].value, pair.quoteToken.decimals).toNumber();
      e.variation = getVariation(e.type == 'Add', e.amount0, e.reserve0);
      return e;
    });

    return all.sort((a,b) => b.block - a.block)
  }

  return [];
}