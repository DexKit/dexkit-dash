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

import {VariableSizeList} from 'react-window';
import {ReactComponent as MoneySendIcon} from 'assets/images/icons/money-send.svg';
import {ViewCoinListItem} from './ViewCoinItem';
import { useCoinsLeague } from 'modules/CoinsLeague/hooks/useCoinsLeague';
import { CoinFeed } from 'modules/CoinsLeague/utils/types';
import { CoinFeed as CoinFeedOnChain} from 'types/coinsleague';
import { MumbaiPriceFeeds } from 'modules/CoinsLeague/constants';

interface Props extends DialogProps {
  title?: string;
  address: string;
  coins: string[];
}

export const ViewCoinLeagueDialog = (props: Props) => {
  const {onClose, title, coins, address} = props;
  const theme = useTheme();
  const { allFeeds } = useCoinsLeague(address)

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [filterText, setFilterText] = useState('');
  const [filteredCoins, setFilteredCoins] = useState<{coin: CoinFeed, feed: CoinFeedOnChain}[]>([]);
  // We join here the Coin List with Onchain Data, we filter for the coins the player have
  const allCoins = useMemo(()=>{
    if(coins && coins.length && allFeeds && allFeeds.length){
      const coinsWithFeeds = allFeeds.filter((cf)=> coins.map(c=> c?.toLowerCase()).includes(cf?.address?.toLowerCase()));
      const coinsList = MumbaiPriceFeeds.filter((c)=>  coinsWithFeeds.map(cf => cf?.address?.toLowerCase()).includes(c?.address?.toLowerCase()));
        return coins.map(c => {return {
          coin: coinsList.find(cl => cl.address.toLowerCase() === c.toLowerCase()),
          feed: coinsWithFeeds.find(cl => cl.address.toLowerCase() === c.toLowerCase()),
        }}
        ).filter(c=> c.coin && c.feed) as {coin: CoinFeed, feed: CoinFeedOnChain}[]
    }
    return [];
  },[coins, allFeeds])

  useEffect(() => {
    if(allCoins && allCoins.length){
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
    [coins],
  );

  const handleClose = useCallback(() => {
    setFilterText('');

    if (onClose) {
      onClose({}, 'escapeKeyDown');
    }
  }, [onClose]);

  return (
    <Dialog
      maxWidth='sm'
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
        {filteredCoins.length == 0 ? (
          <Typography variant='body1'>No coins found</Typography>
        ) : (
          <List>
            <VariableSizeList
              itemData={filteredCoins}
              itemSize={() => 56}
              itemCount={filteredCoins.length}
              width='100%'
              height={250}>
              {({index, data, style}) => (
                <ViewCoinListItem
                  style={style}
                  coin={data[index].coin}
                  feedOnchain={data[index].feed}
                  key={index}
                />
              )}
            </VariableSizeList>
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewCoinLeagueDialog;
