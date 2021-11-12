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

    let id = tx
      .then(async (tx: any) => {
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
      })
      .catch((err: any) => {
        console.log(err);
        reject(err);
      });
  });
}

export const getChampionMetadata = (tokenId: string, chainId?: number) => {
  let url = `https://coinleaguechampions.dexkit.com/api/${tokenId}`;

  if (chainId === ChainId.Mumbai) {
    url = `https://coinleaguechampions-mumbai.dexkit.com/api/${tokenId}`;
  }

  return axios.get<ChampionMetadata>(url).then((response) => response.data);
};
