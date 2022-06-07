import { ethers } from 'ethers';
import { useWeb3 } from 'hooks/useWeb3';
import { GET_CHAMPIONS_CONTRACT_ADDR } from 'modules/CoinLeague/utils/champions';
import { useQuery } from 'react-query';

const USE_CHAMPION_POINTS = 'USE_CHAMPION_POINTS';

export function useChampionPoints(tokenId?: string) {
  const { chainId, getProvider } = useWeb3();

  return useQuery([USE_CHAMPION_POINTS, tokenId, chainId], async () => {
    const address = GET_CHAMPIONS_CONTRACT_ADDR(chainId);

    if (address === undefined || tokenId === undefined) {
      return;
    }

    const contract = new ethers.Contract(
      address,
      [
        'function attack(uint256) external view returns (uint256)',
        'function defense(uint256) external view returns (uint256)',
        'function run(uint256) external view returns (uint256)',
      ],
      new ethers.providers.Web3Provider(getProvider()),
    );

    const attack: ethers.BigNumber = await contract.attack(tokenId);
    const defense: ethers.BigNumber = await contract.defense(tokenId);
    const run: ethers.BigNumber = await contract.run(tokenId);

    return {
      attack: attack.toNumber(),
      defense: defense.toNumber(),
      run: run.toNumber(),
      total: attack.add(defense).add(run).toNumber(),
    };
  });
}
