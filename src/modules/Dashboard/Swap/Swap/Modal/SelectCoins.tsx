import React, {useEffect, useCallback, useState} from 'react';
import {useTheme} from '@material-ui/core/styles';

import {
  Dialog,
  DialogProps,
  Typography,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  useMediaQuery,
  List,
  Box,
  makeStyles,
  IconButton,
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

import {ChangellyCoin} from 'types/changelly';
import SelectCoinListItem from '../Components/SelectCoinListItem';

const useStyles = makeStyles((theme) => ({
  list: {
    maxHeight: theme.spacing(150),
    overflowY: 'scroll',
  },
}));

interface Props extends DialogProps {
  coins: ChangellyCoin[];
  onSelectCoin: (coin: ChangellyCoin) => void;
}

export const SelectCoinsDialog = (props: Props) => {
  const {onSelectCoin, coins, onClose} = props;
  const theme = useTheme();
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [filterText, setFilterText] = useState('');

  const [filteredCoins, setFilteredCoins] = useState<ChangellyCoin[]>([]);

  useEffect(() => {
    setFilteredCoins(coins);
  }, [coins]);

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      setFilterText(value);

      let filtered = coins.filter((coin: ChangellyCoin) =>
        coin.name.startsWith(value),
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
      maxWidth='xl'
      {...props}
      aria-labelledby='form-dialog-title'
      fullScreen={fullScreen}>
      <DialogTitle id='form-dialog-title'>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='body1'>Select a coin</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
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
        {filteredCoins.length == 0 ? (
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
