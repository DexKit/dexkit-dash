import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {useIntl} from 'react-intl';

import {useTheme} from '@material-ui/core/styles';

import {useNetwork} from 'hooks/useNetwork';

import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import {DialogProps, makeStyles} from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import CloseIcon from '@material-ui/icons/Close';

import {Token} from 'types/app';
import {VariableSizeList} from 'react-window';
import {ReactComponent as MoneySendIcon} from 'assets/images/icons/money-send.svg';
import {MyBalances} from 'types/blockchain';
import SelectTokenBalanceListItem from '../../components/SelectTokenBalanceListItem';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import IntlMessages from '../../../../../@crema/utility/IntlMessages';

const useStyles = makeStyles(() => ({
  content: {
    margin: 0,
    padding: 0,
  },
}));

interface Props extends DialogProps {
  title?: string;
  tokens: Token[];
  balances: MyBalances[];
  onSelectToken: (token: Token) => void;
  enableFilters?: boolean;
}

export type TokenBalance = Token & {
  value?: number | null;
  valueInUsd?: number | null;
};

export const SelectTokenBalanceDialog = (props: Props) => {
  const {onSelectToken, tokens, balances, onClose, title, enableFilters} =
    props;

  const classes = useStyles();
  const {messages} = useIntl();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [filterText, setFilterText] = useState('');

  const allTokens = useMemo(() => {
    if (tokens && tokens.length) {
      return tokens
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

  const filteredTokens = useMemo(() => {
    return allTokens.filter(
      (coin: Token) =>
        coin.name.toLowerCase().startsWith(filterText.toLowerCase()) ||
        coin.symbol.toLowerCase().startsWith(filterText.toLowerCase()),
    );
  }, [allTokens, filterText]);

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

  const [selectedNetwork, setSelectedNetwork] = useState<EthereumNetwork>();

  /* eslint-disable */
  const getFilteredTokens = useCallback(
    (tokens: Token[], selectedNetwork?: EthereumNetwork) => {
      if (selectedNetwork) {
        return tokens.filter((t) => t.networkName === selectedNetwork);
      }

      return tokens;
    },
    [selectedNetwork],
  );

  const network = useNetwork();

  useEffect(() => {
    setSelectedNetwork(network);
  }, [network]);

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
              {title || <IntlMessages id='app.dashboard.selectToken' />}
            </Typography>
          </Box>
          <IconButton size='small' onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers className={classes.content}>
        <Box px={4} py={4} pb={2}>
          <TextField
            autoComplete='off'
            autoFocus
            id='name'
            placeholder={messages['app.dashboard.searchTokens'] as string}
            fullWidth
            value={filterText}
            variant='outlined'
            onChange={handleFilterChange}
          />
        </Box>
        {enableFilters ? (
          <>
            <Box px={4} pt={2} pb={4}>
              <Box>
                <Grid container spacing={2}>
                  <Grid item>
                    <Chip
                      clickable
                      size='small'
                      label={messages['app.dashboard.all'] as string}
                      variant={
                        selectedNetwork === undefined ? 'default' : 'outlined'
                      }
                      onClick={() => {
                        setSelectedNetwork(undefined);
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Chip
                      clickable
                      size='small'
                      label='ETH'
                      variant={
                        selectedNetwork === EthereumNetwork.ethereum
                          ? 'default'
                          : 'outlined'
                      }
                      onClick={() => {
                        setSelectedNetwork(EthereumNetwork.ethereum);
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Chip
                      clickable
                      size='small'
                      label='BSC'
                      variant={
                        selectedNetwork === EthereumNetwork.bsc
                          ? 'default'
                          : 'outlined'
                      }
                      onClick={() => {
                        setSelectedNetwork(EthereumNetwork.bsc);
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Chip
                      clickable
                      size='small'
                      label='MATIC'
                      variant={
                        selectedNetwork === EthereumNetwork.matic
                          ? 'default'
                          : 'outlined'
                      }
                      onClick={() => {
                        setSelectedNetwork(EthereumNetwork.matic);
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Divider />
          </>
        ) : null}
        {getFilteredTokens(filteredTokens, selectedNetwork).length == 0 ? (
          <Box p={4}>
            <Typography variant='body1'>
              <IntlMessages id='app.dashboard.noTokensFound' />
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            <VariableSizeList
              itemData={getFilteredTokens(filteredTokens, selectedNetwork)}
              itemSize={() => 56}
              itemCount={
                getFilteredTokens(filteredTokens, selectedNetwork).length
              }
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
