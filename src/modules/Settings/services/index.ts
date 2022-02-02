import {ethers} from 'ethers';

import erc20Abi from 'shared/constants/ABI/erc20.json';

export async function getTokenInfo(
  provider: ethers.providers.Web3Provider,
  address: string,
): Promise<{symbol: string; decimals: number; name: string}> {
  const contract = new ethers.Contract(address, erc20Abi, provider);
  try {
    const symbol = await contract.symbol();
    const decimals = await contract.decimals();
    const name = await contract.name();
    return {symbol, decimals, name};
  } catch (err) {
    return {symbol: '', decimals: 0, name: ''};
  }
}
