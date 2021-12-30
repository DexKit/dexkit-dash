import React, {useEffect, useCallback, useState} from 'react';
import {useTheme} from '@material-ui/core/styles';

import {
  Grid,
  Chip,
  Divider,
  Dialog,
  DialogProps,
  Typography,
  DialogContent,
  DialogTitle,
  TextField,
  useMediaQuery,
  List,
  Box,
  makeStyles,
  IconButton,
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

import SelectTokenListItem from './SelectTokenListItem';

import {Token} from '../../../types/app';
import {ChainId} from 'types/blockchain';
import CustomDialogTitle from '../CustomDialogTitle';

const useStyles = makeStyles((theme) => ({
  list: {
    maxHeight: theme.spacing(150),
    overflowY: 'scroll',
  },
  content: {
    padding: 0,
    margin: 0,
  },
}));

interface Props extends DialogProps {
  tokens: Token[];
  onSelectToken: (coin: Token) => void;
  showNetwork?: boolean;
  chainId?: ChainId;
}

export const SelectTokenDialog = (props: Props) => {
  const {onSelectToken, tokens, onClose, showNetwork, chainId} = props;
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
      const value = e.target.value;

      setFilterText(value);

      const filtered = tokens.filter((token: Token) =>
        token.name.toLowerCase().startsWith(value.toLowerCase()),
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

  const [selectedChainId, setSelectedChainId] = useState<ChainId | undefined>(
    chainId,
  );

  const handleAll = useCallback(() => {
    setSelectedChainId(undefined);
  }, []);

  const handleEthereum = useCallback(() => {
    setSelectedChainId(ChainId.Mainnet);
  }, []);

  const handleBsc = useCallback(() => {
    setSelectedChainId(ChainId.Binance);
  }, []);

  const handleMatic = useCallback(() => {
    setSelectedChainId(ChainId.Matic);
  }, []);

  const getFilteredTokens = useCallback(
    (filteredTokens: Token[], selectedChainId?: ChainId) => {
      if (selectedChainId) {
        return filteredTokens.filter((t) => t.chainId === selectedChainId);
      }

      return filteredTokens;
    },
    [],
  );

  return (
    <Dialog maxWidth='sm' fullWidth {...props} fullScreen={fullScreen}>
      <CustomDialogTitle title={"Select a token"} onClose={handleClose}/>
      
      <DialogContent dividers className={classes.content}>
        <Box px={4} pt={4} pb={2}>
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
        <Box px={4} py={4}>
          <Grid container spacing={2}>
            <Grid item>
              <Chip
                size='small'
                label='All'
                variant={selectedChainId === undefined ? 'default' : 'outlined'}
                onClick={handleAll}
              />
            </Grid>
            <Grid item>
              <Chip
                size='small'
                label='ETH'
                onClick={handleEthereum}
                variant={
                  selectedChainId === ChainId.Mainnet ? 'default' : 'outlined'
                }
              />
            </Grid>
            <Grid item>
              <Chip
                size='small'
                label='BSC'
                onClick={handleBsc}
                variant={
                  selectedChainId === ChainId.Binance ? 'default' : 'outlined'
                }
              />
            </Grid>
            <Grid item>
              <Chip
                size='small'
                label='Matic'
                onClick={handleMatic}
                variant={
                  selectedChainId === ChainId.Matic ? 'default' : 'outlined'
                }
              />
            </Grid>
          </Grid>
        </Box>
        <Divider />
        {getFilteredTokens(filteredTokens, selectedChainId).length === 0 ? (
          <Box p={4}>
            <Typography variant='body1'>No tokens found</Typography>
          </Box>
        ) : (
          <List>
            {getFilteredTokens(filteredTokens, selectedChainId).map(
              (token, index: number) => (
                <SelectTokenListItem
                  showNetwork={showNetwork}
                  onClick={handleSelectToken}
                  token={token}
                  key={index}
                />
              ),
            )}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SelectTokenDialog;
