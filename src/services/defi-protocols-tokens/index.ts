import { DefiClient } from './defiSdkClient';
import { ProtocolBalanceInterface } from 'defi-sdk/src/protocols/interfaces';

export async function getDefiBalances(tokenAddress: string): Promise<ProtocolBalanceInterface[]> {
  return DefiClient.getAccountBalances('0x34E89740adF97C3A9D3f63Cc2cE4a914382c230b');
  // return DefiClient.getAccountBalances(tokenAddress);
}