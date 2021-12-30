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

import {ChangellyCoin} from 'types/changelly';
import SelectCoinListItem from '../Components/SelectCoinListItem';
import CustomDialogTitle from 'shared/components/CustomDialogTitle';
import {useIntl} from 'react-intl';

interface Props extends DialogProps {
  coins: ChangellyCoin[];
  onSelectCoin: (coin: ChangellyCoin) => void;
  selectTo: string;
}

export const SelectCoinsDialog = (props: Props) => {
  const {onSelectCoin, coins, onClose, selectTo} = props;
  const theme = useTheme();
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
  const {messages} = useIntl();
  return (
    <Dialog
      maxWidth='sm'
      fullWidth
      {...props}
      aria-labelledby='form-dialog-title'
      fullScreen={fullScreen}>
      <CustomDialogTitle
        title={messages['app.dashboard.selectACoin']}
        onClose={handleClose}
      />

      <DialogContent dividers>
        <Box mb={4}>
          <TextField
            autoFocus
            id='name'
            placeholder='Search coins'
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
