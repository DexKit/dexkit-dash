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
import SelectTokenListItem from './SelectTokenListItem';

import {Token} from '../../../types/app';

const useStyles = makeStyles((theme) => ({
  list: {
    maxHeight: theme.spacing(150),
    overflowY: 'scroll',
  },
}));

interface Props extends DialogProps {
  tokens: Token[];
  onSelectToken: (coin: Token) => void;
}

export const SelectTokenDialog = (props: Props) => {
  const {onSelectToken, tokens, onClose} = props;
  const theme = useTheme();
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [filterText, setFilterText] = useState('');

  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);

  useEffect(() => {
    setFilteredTokens(tokens);
  }, [tokens]);

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      setFilterText(value);

      let filtered = tokens.filter((token: Token) =>
        token.name.startsWith(value),
      );

      setFilteredTokens(filtered);
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
    if (onClose) {
      onClose({}, 'escapeKeyDown');
    }
  }, [onClose]);

  return (
    <Dialog maxWidth='xl' {...props} fullScreen={fullScreen}>
      <DialogTitle>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='body1'>Select a token</Typography>
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
            {filteredTokens.map((token, index: number) => (
              <SelectTokenListItem
                onClick={handleSelectToken}
                token={token}
                key={index}
              />
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SelectTokenDialog;
