import {ethers} from 'ethers';
import axios from 'axios';
import championsAbi from '../constants/ABI/coinLeagueChampions.json';
import {getEventCurrentRound, getEventHoldingAmount} from '../utils/champions';

import {ChampionMetadata, ChampionsEventRound} from '../utils/types';
import {ChainId} from 'types/blockchain';

const RandomnessRequestAbi =
  'event RandomnessRequest(bytes32 keyHash, uint256 seed, bytes32 indexed jobID, address sender, uint256 fee, bytes32 requestID)';

export function mintCoinLeaguesChampion(
  provider: ethers.providers.Web3Provider,
  address: string,
  chainId?: number,
  onTransaction?: (hash: string) => void,
) {
  return new Promise<string>((resolve, reject) => {
    let contract = new ethers.Contract(
      address,
      championsAbi,
      provider.getSigner(),
    );

    let round = getEventCurrentRound();

    let transactionParam = {value: getEventHoldingAmount(chainId)};

    let tx = null;

    if (round === ChampionsEventRound.FIRST) {
      tx = contract.mintFirstRound(transactionParam);
    } else if (round === ChampionsEventRound.SECOND) {
      tx = contract.mintSecondRound(transactionParam);
    } else if (round === ChampionsEventRound.THIRD) {
      tx = contract.mintThirdRound(transactionParam);
    }

    tx.then(async (tx: any) => {
      if (tx.hash && onTransaction) {
        onTransaction(tx.hash);
      }

      let result = await tx.wait();

      let iface = new ethers.utils.Interface([RandomnessRequestAbi]);

      let log = result.logs[3];

      let logResult = iface.parseLog(log);

      let requestId = logResult.args['requestID'];

      let id = await contract.requestToTokenId(requestId);

      resolve(id);
    }).catch((err: any) => {
      reject(err);
    });
  });
}

export const getChampionApiEndpoint = (chainId?: number) => {
  if (!chainId) {
    return undefined;
  }

  if (chainId === ChainId.Matic) {
    return `https://coinleaguechampions.dexkit.com/api`;
  }

  if (chainId === ChainId.Mumbai) {
    return `https://coinleaguechampions-mumbai.dexkit.com/api`;
  }

  if (chainId === ChainId.Binance) {
    return `https://coinleaguechampions-bsc.dexkit.com/api`;
  }
};

export const getChampionMetadata = (tokenId: string, chainId?: number) => {
  return axios
    .get<ChampionMetadata>(`${getChampionApiEndpoint(chainId)}/${tokenId}`)
    .then((response) => response.data);
};

export const getChampionsTotalSupply = (chainId?: number) => {
  return axios
    .get<{totalSupply: number}>(
      `${getChampionApiEndpoint(chainId)}/total-supply`,
    )
    .then((response) => response.data);
};
