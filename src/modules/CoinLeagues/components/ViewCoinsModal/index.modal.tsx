import React, {useEffect, useCallback, useState, useMemo} from 'react';
import {useTheme} from '@material-ui/core/styles';

import {
  Dialog,
  DialogProps,
  Typography,
  DialogContent,
  DialogTitle,
  TextField,
  useMediaQuery,
  List,
  Box,
  IconButton,
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

import {ReactComponent as MoneySendIcon} from 'assets/images/icons/money-send.svg';
import {ViewCoinListItem} from './ViewCoinItem';
import {useCoinLeagues} from 'modules/CoinLeagues/hooks/useCoinLeagues';
import {CoinFeed} from 'modules/CoinLeagues/utils/types';
import {CoinFeed as CoinFeedOnChain} from 'types/coinsleague';
import {PriceFeeds} from 'modules/CoinLeagues/constants';
import {useWeb3} from 'hooks/useWeb3';
import {GET_LEAGUES_CHAIN_ID} from 'modules/CoinLeagues/utils/constants';
import {useMultipliers} from 'modules/CoinLeagues/hooks/useMultipliers';
interface Props extends DialogProps {
  title?: string;
  id: string;
  playerAddress?: string;
  coins: string[];
  captainCoin?: string;
}

export const ViewCoinLeagueDialog = (props: Props) => {
  const {onClose, coins, id, captainCoin, playerAddress} = props;
  const {chainId} = useWeb3();
  const theme = useTheme();
  const {allFeeds, currentPrices, game} = useCoinLeagues(id);
  const {multiplier, tooltipMessage} = useMultipliers(id);
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [filterText, setFilterText] = useState('');
  const [filteredCoins, setFilteredCoins] = useState<
    {
      coin: CoinFeed;
      feed: CoinFeedOnChain;
      currentFeed: any;
      isCaptain: boolean;
    }[]
  >([]);
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

  useEffect(() => {
    if (allCoins && allCoins.length) {
      setFilteredCoins(allCoins);
    }
  }, [allCoins]);

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setFilterText(value);
      const filtered = allCoins.filter(
        (c) =>
          c.coin.baseName.toLowerCase().startsWith(value.toLowerCase()) ||
          c.coin.base.toLowerCase().startsWith(value.toLowerCase()),
      );
      setFilteredCoins(filtered);
    },
    [allCoins],
  );

  const handleClose = useCallback(() => {
    setFilterText('');

    if (onClose) {
      onClose({}, 'escapeKeyDown');
    }
  }, [onClose]);

  return (
    <Dialog
      maxWidth='md'
      fullWidth
      {...props}
      aria-labelledby='form-dialog-title'
      fullScreen={fullScreen}>
      <DialogTitle id='form-dialog-title'>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Box display='flex' alignItems='center'>
            <Box display='flex' pr={2}>
              <MoneySendIcon />
            </Box>
            <Typography variant='body1'>{'Select a Coin'}</Typography>
          </Box>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box mb={4} p={2}>
          <TextField
            autoComplete='off'
            autoFocus
            id='name'
            placeholder='Search tokens'
            fullWidth
            value={filterText}
            variant='outlined'
            onChange={handleFilterChange}
          />
        </Box>
        {filteredCoins.length === 0 ? (
          <Typography variant='body1'>No coins found</Typography>
        ) : (
          <List>
            {filteredCoins.map((coin, i) => (
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
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewCoinLeagueDialog;
