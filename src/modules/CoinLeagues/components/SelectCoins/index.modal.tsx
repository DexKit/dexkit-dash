import React, {useCallback, useState, useMemo} from 'react';
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
import {CoinFeed} from 'modules/CoinLeagues/utils/types';
import {SelectCoinListItem} from './SelectCoinItem';
import {PriceFeeds} from 'modules/CoinLeagues/constants';
import {ChainId} from 'types/blockchain';

interface Props extends DialogProps {
  title?: string;
  chainId: ChainId.Matic | ChainId.Mumbai;
  selectedCoins?: CoinFeed[];
  onSelectCoin: (coin: CoinFeed, isCaptainCoin: boolean) => void;
  isCaptainCoin: boolean;
}

export const SelectCoinLeagueDialog = (props: Props) => {
  const {onSelectCoin, onClose, chainId, selectedCoins, isCaptainCoin} =
    props;
  // TODO: Change to Mainnet
  const coins = PriceFeeds[chainId];
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [filterText, setFilterText] = useState('');

  const filteredCoins = useMemo(() => {
    return coins
      .filter(
        (coin: CoinFeed) =>
          coin.baseName.toLowerCase().startsWith(filterText?.toLowerCase()) ||
          coin.base.toLowerCase().startsWith(filterText?.toLowerCase()),
      )
      .filter((c) => !selectedCoins?.includes(c));
  }, [filterText, selectedCoins, coins]);

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFilterText(value);
    },
    [],
  );

  const handleSelectCoin = useCallback(
    (coin: CoinFeed) => {
      setFilterText('');
      onSelectCoin(coin, isCaptainCoin);
    },
    [onSelectCoin, isCaptainCoin],
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
            <Typography variant='body1'>
              {isCaptainCoin ? 'Select Captain Coin' : 'Select a Coin'}
            </Typography>
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
