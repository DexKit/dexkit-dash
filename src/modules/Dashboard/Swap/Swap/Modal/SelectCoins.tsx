import React, {useCallback, useEffect, useState} from 'react';

import {useIntl} from 'react-intl';
import IntlMessages from '@crema/utility/IntlMessages';

import {useTheme} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import {DialogProps, makeStyles} from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import CloseIcon from '@material-ui/icons/Close';

import {ChangellyCoin} from 'types/changelly';
import SelectCoinListItem from '../Components/SelectCoinListItem';

interface Props extends DialogProps {
  coins: ChangellyCoin[];
  onSelectCoin: (coin: ChangellyCoin) => void;
  selectTo: string;
}

export const SelectCoinsDialog = (props: Props) => {
  const {onSelectCoin, coins, onClose, selectTo} = props;
  const theme = useTheme();
  const {messages} = useIntl();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [filterText, setFilterText] = useState('');

  const [filteredCoins, setFilteredCoins] = useState<ChangellyCoin[]>([]);

  useEffect(() => {
    if (selectTo === 'to') {
      setFilteredCoins(coins.filter((coin) => coin.enabledTo));
    } else if (selectTo === 'from') {
      setFilteredCoins(coins.filter((coin) => coin.enabledFrom));
    }
  }, [selectTo, coins]);

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setFilterText(value);

      const filtered = coins.filter(
        (coin: ChangellyCoin) =>
          coin.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
          coin.ticker.toLowerCase().indexOf(value.toLowerCase()) !== -1,
      );

      setFilteredCoins(filtered);
    },
    [coins],
  );

  const handleSelectCoin = useCallback(
    (coin: ChangellyCoin) => {
      onSelectCoin(coin);
    },
    [onSelectCoin],
  );

  const handleClose = useCallback(() => {
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
          <Typography variant='body1'>
            <IntlMessages id='app.dashboard.selectCoin' />
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box mb={4}>
          <TextField
            autoFocus
            id='name'
            placeholder={messages['app.dashboard.searchCoins'] as string}
            fullWidth
            value={filterText}
            variant='outlined'
            onChange={handleFilterChange}
          />
        </Box>
        {filteredCoins.length == 0 ? (
          <Typography variant='body1'>
            <IntlMessages id='app.dashboard.noCoinsFound' />
          </Typography>
        ) : (
          <List>
            {filteredCoins.map((coin, index: number) => (
              <SelectCoinListItem
                onClick={handleSelectCoin}
                coin={coin}
                key={index}
              />
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};
