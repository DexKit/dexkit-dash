import { NETWORK } from "shared/constants/AppEnums";


export function parseLastTradeByPair(data: any, address: string, network: NETWORK): string {

  if (data && data.data[network] && data.data[network].data[0]) {
      return data.data[network].data[0].smartContract.address.address;
  }

  return '0x'
  
}