import { ChainId } from "types/blockchain";
import isURL from "validator/lib/isURL";
import { isNativeCoinWithoutChainId } from "./tokens";

export const truncateAddress = (address: string|undefined ) => {
  if (address) {
    return `${address.slice(0, 7)}...${address.slice(address.length - 5)}`;
  }
  return '';
};

export const truncateTokenAddress = (address: string|undefined ) => {
  if(address && isNativeCoinWithoutChainId(address) ){
    return address.toUpperCase();
  }
  if (address) {
    return `${address.slice(0, 7)}...${address.slice(address.length - 5)}`;
  }
  return '';
};

export const truncateText = (address: string, maxLen: number) => {
  if (!address) {
    return '';
  }

  return `${address.slice(0, maxLen-1)}${address?.length > maxLen ? '...' : ''}`;
};


export function capitalize(str: string, separator: string = ' ', separatorToJoinString: string = ' ') {
  return str?.split(separator)
    .map(s => s.replace(s?.charAt(0), s?.charAt(0)?.toUpperCase()))
    .join(separatorToJoinString);
}

export const urlValidator = (url: string) => {
  return isURL(url, {
    protocols: ['http','https']
  });
}
