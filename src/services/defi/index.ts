import { DefiClient } from './defiSdkClient';
import { ProtocolBalanceInterface } from 'defi-sdk/src/protocols/interfaces';

export async function getDefiBalances(tokenAddress: string): Promise<ProtocolBalanceInterface[]> {
  return DefiClient.getAccountBalances(tokenAddress);
}