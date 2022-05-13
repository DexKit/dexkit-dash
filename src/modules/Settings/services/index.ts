import { ethers } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import { getMulticallFromProvider } from 'services/multicall';
import { CallInput } from '@indexed-finance/multicall';

import erc20Abi from 'shared/constants/ABI/erc20.json';

export async function getTokenInfo(
  provider: ethers.providers.Web3Provider,
  address: string,
): Promise<{ symbol: string; decimals: number; name: string }> {

  try {
    const multicall = await getMulticallFromProvider(provider);
    const iface = new Interface(erc20Abi);
    let calls: CallInput[] = [];
    calls.push({
      interface: iface,
      target: address,
      function: 'symbol',

    });
    calls.push({
      interface: iface,
      target: address,
      function: 'decimals',

    });
    calls.push({
      interface: iface,
      target: address,
      function: 'name',
    });
    const response = await multicall.multiCall(calls);
    const [, results] = response;

    const symbol = results[0];
    const decimals = results[1];
    const name = results[2];
    return { symbol, decimals, name };
  } catch (err) {
    throw new Error('error fetching token data from provider');
  }
}
