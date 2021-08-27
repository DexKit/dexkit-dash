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

import SelectTokenListItem from '../../components/SelectTokenListItem';
import {Token} from 'types/app';
import {VariableSizeList} from 'react-window';
import {ReactComponent as MoneySendIcon} from 'assets/images/icons/money-send.svg';

interface Props extends DialogProps {
  title?: string;
  tokens: Token[];
  onSelectToken: (token: Token) => void;
}

export const SelectTokenDialog = (props: Props) => {
  const {onSelectToken, tokens, onClose, title} = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [filterText, setFilterText] = useState('');

  const [filteredTokens, setFilteredCoins] = useState<Token[]>([]);

  useEffect(() => {
    setFilteredCoins(tokens);
  }, [tokens]);

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setFilterText(value);

      const filtered = tokens.filter(
        (coin: Token) =>
          coin.name.toLowerCase().startsWith(value.toLowerCase()) ||
          coin.symbol.toLowerCase().startsWith(value.toLowerCase()),
      );

      setFilteredCoins(filtered);
    },
    [tokens],
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
                <SelectTokenListItem
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

export default SelectTokenDialog;
