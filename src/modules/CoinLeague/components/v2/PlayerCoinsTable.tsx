import React, {useMemo} from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';

import {ViewCoinListItem} from '../ViewCoinsModal/ViewCoinItem';
import {useCoinLeagues} from 'modules/CoinLeague/hooks/useCoinLeagues';
import {CoinFeed} from 'modules/CoinLeague/utils/types';
import {CoinFeed as CoinFeedOnChain} from 'types/coinsleague';
import {PriceFeeds} from 'modules/CoinLeague/constants';
import {useLeaguesChainInfo} from 'modules/CoinLeague/hooks/useLeaguesChainInfo';
import {GET_LEAGUES_CHAIN_ID} from 'modules/CoinLeague/utils/constants';
import {useMultipliers} from 'modules/CoinLeague/hooks/useMultipliers';
import IntlMessages from '@crema/utility/IntlMessages';

interface Props {
  id: string;
  playerAddress?: string;
  coins: string[];
  captainCoin?: string;
}

export const PlayerCoinsTable = (props: Props) => {
  const {coins, id, captainCoin, playerAddress} = props;

  const {chainId} = useLeaguesChainInfo();

  const {allFeeds, currentPrices, game} = useCoinLeagues(id);
  const {multiplier, tooltipMessage} = useMultipliers(id);

  // We join here the Coin List with Onchain Data, we filter for the coins the player have

  const allCoins = useMemo(() => {
    const chain = GET_LEAGUES_CHAIN_ID(chainId);

    if (coins && captainCoin && allFeeds && allFeeds.length) {
      const coinsWithFeeds = allFeeds.filter((cf) =>
        coins
          .concat(captainCoin)
          .map((c) => c?.toLowerCase())
          .includes(cf?.address?.toLowerCase()),
      );
      const coinsList = PriceFeeds[chain].filter((c) =>
        coinsWithFeeds
          .map((cf) => cf?.address?.toLowerCase())
          .includes(c?.address?.toLowerCase()),
      );
      return [captainCoin]
        .concat(coins)
        .map((c) => {
          return {
            coin: coinsList.find(
              (cl) => cl.address.toLowerCase() === c.toLowerCase(),
            ),
            isCaptain: c.toLowerCase() === captainCoin.toLowerCase(),
            feed: coinsWithFeeds.find(
              (cl) => cl.address.toLowerCase() === c.toLowerCase(),
            ),
            currentFeed: currentPrices?.find(
              (cl) => cl.feed.toLowerCase() === c.toLowerCase(),
            ),
          };
        })
        .filter((c) => c.coin && c.feed) as {
        coin: CoinFeed;
        feed: CoinFeedOnChain;
        currentFeed: any;
        isCaptain: boolean;
      }[];
    }
    return [];
  }, [coins, allFeeds, currentPrices, chainId, captainCoin]);

  const gameStarted = useMemo(() => {
    return game?.started && !game.finished && !game.aborted;
  }, [game]);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <IntlMessages id='coinLeague.coin' defaultMessage='Coin' />
            </TableCell>
            <TableCell>
              <IntlMessages
                id='coinLeague.startPrice'
                defaultMessage='Start Price'
              />
            </TableCell>
            <TableCell>
              <IntlMessages
                id='coinLeague.endPrice'
                defaultMessage='End Price'
              />
            </TableCell>
            <TableCell>
              <IntlMessages id='coinLeague.score' defaultMessage='Score' />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allCoins.map((coin, i) => (
            <ViewCoinListItem
              coin={coin.coin}
              feedOnchain={coin.feed}
              currentPrice={coin.currentFeed}
              started={gameStarted}
              key={i}
              isCaptain={coin.isCaptain}
              playerAddress={playerAddress}
              multipliers={multiplier}
              tooltipMessage={tooltipMessage}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PlayerCoinsTable;
