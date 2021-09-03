import React, {useEffect, useCallback, useState} from 'react';
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
import { CoinFeed } from 'modules/CoinsLeague/utils/types';
import {SelectCoinListItem} from './SelectCoinItem'
import { MumbaiPriceFeeds } from 'modules/CoinsLeague/constants';
interface Props extends DialogProps {
  title?: string;
  onSelectCoin: (coin: CoinFeed) => void;
}

export const SelectCoinLeagueDialog = (props: Props) => {
  const {onSelectCoin,  onClose, title} = props;
  // TODO: Change to Mainnet
  const coins = MumbaiPriceFeeds;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [filterText, setFilterText] = useState('');

  const [filteredCoins, setFilteredCoins] = useState<CoinFeed[]>([]);

  useEffect(() => {
    setFilteredCoins(coins);
  }, [coins]);

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setFilterText(value);

      const filtered = coins.filter(
        (coin: CoinFeed) =>
          coin.baseName.toLowerCase().startsWith(value.toLowerCase()) ||
          coin.base.toLowerCase().startsWith(value.toLowerCase()),
      );

      setFilteredCoins(filtered);
    },
    [coins],
  );

  const handleSelectCoin = useCallback(
    (coin: CoinFeed) => {
      onSelectCoin(coin);
    },
    [onSelectCoin],
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
                <SelectCoinListItem
                  style={style}
                  onClick={handleSelectCoin}
                  coin={data[index]}
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

export default SelectCoinLeagueDialog;
