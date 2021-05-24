import { Token } from "types/app";

export function parseTokenInfoData(data: any): Token {
  if (data && data.data.ethereum.address && data.data.ethereum.address.length > 0) {
    const e = data.data.ethereum.address[0];
    return {
      name: e.smartContract.currency.name,
      symbol: e.smartContract.currency.symbol,
      address: e.address,
      decimals: e.smartContract.currency.decimals,
      type: e.smartContract.currency.tokenType,
      annotation: e.annotation||'',
      balance: e.balance
    }
  }
  return {
    name: '-',
    symbol: '-',
    address: '-',
    decimals: 0,
    type: '-',
    annotation: '-',
    balance: 0
  };
}