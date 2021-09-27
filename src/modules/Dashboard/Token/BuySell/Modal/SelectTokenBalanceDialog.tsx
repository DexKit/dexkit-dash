import React, {useMemo, useCallback, useState} from 'react';
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

import {Token} from 'types/app';
import {VariableSizeList} from 'react-window';
import {ReactComponent as MoneySendIcon} from 'assets/images/icons/money-send.svg';
import {MyBalances} from 'types/blockchain';
import SelectTokenBalanceListItem from '../../components/SelectTokenBalanceListItem';

interface Props extends DialogProps {
  title?: string;
  tokens: Token[];
  balances: MyBalances[];
  onSelectToken: (token: Token) => void;
}

export type TokenBalance = Token & {
  value?: number | null;
  valueInUsd?: number | null;
};

export const SelectTokenBalanceDialog = (props: Props) => {
  const {onSelectToken, tokens, balances, onClose, title} = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [filterText, setFilterText] = useState('');

  const allTokens = useMemo(() => {
    if (tokens && tokens.length) {
      return  tokens
        .map((t) => {
          const balance = balances.find(
            (b) =>
              b.currency?.address?.toLowerCase() === t.address.toLowerCase(),
          );
          return {
            ...t,
            ...balance,
          } as TokenBalance;
          // Sort coins first by usd and then by balance
        })
        .sort((a, b) => {
          if (a?.valueInUsd || b?.valueInUsd) {
            return (b?.valueInUsd || 0) - (a?.valueInUsd || 0);
          }
          return (b?.value || 0) - (a?.value || 0);
        });
    }
    return [];
  }, [tokens, balances]);

  const filteredTokens = useMemo(()=> {
    return allTokens.filter(
      (coin: Token) =>
        coin.name.toLowerCase().startsWith(filterText.toLowerCase()) ||
        coin.symbol.toLowerCase().startsWith(filterText.toLowerCase()),
    );
  },[allTokens, filterText])

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFilterText(value);
    },
    [],
  );

  const handleSelectToken = useCallback(
    (token: Token) => {
      onSelectToken(token);
    },
    [onSelectToken],
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
            <Typography variant='body1'>{title || 'Select a token'}</Typography>
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
        {filteredTokens.length == 0 ? (
          <Typography variant='body1'>No tokens found</Typography>
        ) : (
          <List>
            <VariableSizeList
              itemData={filteredTokens}
              itemSize={() => 56}
              itemCount={filteredTokens.length}
              width='100%'
              height={250}>
              {({index, data, style}) => (
                <SelectTokenBalanceListItem
                  style={style}
                  onClick={handleSelectToken}
                  token={data[index]}
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

export default SelectTokenBalanceDialog;
