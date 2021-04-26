import { OrderData, Token } from "types/app";
import { EXCHANGE } from "shared/constants/Bitquery";

export const GET_PROTOCOL_PAIR_URL = (exchange: EXCHANGE, data: OrderData) => {
    switch (exchange) {
      case EXCHANGE.UNISWAP:
        return `/protocol-explorer/uniswap/pair-explorer/${data.contract}`;
     case EXCHANGE.ZEROX:
          return `/protocol-explorer/0x-protocol/pair-explorer/${data.baseToken.address}-${data.quoteToken.address}`;
      default:
        return `/protocol-explorer/uniswap/pair-explorer/${data.contract}`;
    }
}


export const GET_PROTOCOL_TOKEN_URL = (token: Token, exchange: EXCHANGE) => {
  switch (exchange) {
    case EXCHANGE.UNISWAP:
      return `/protocol-explorer/uniswap/token-explorer/${token.address}`;
   case EXCHANGE.ZEROX:
        return `/protocol-explorer/0x-protocol/token-explorer/${token.address}`;
    default:
      return `/protocol-explorer/uniswap/token-explorer/${token.address}`;
  }

}
