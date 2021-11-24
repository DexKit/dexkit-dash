import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  Backdrop,
  IconButton,
} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';

import {makeStyles} from '@material-ui/core/styles';
import {Fonts} from 'shared/constants/AppEnums';
import {CremaTheme} from 'types/AppContextPropsType';
import Receiver from './Receiver';
import Sender from './Sender';
import {Token} from 'types/app';
import {MyBalances} from 'types/blockchain';
import {useNetwork} from 'hooks/useNetwork';
// import {tokenSymbolToDisplayString} from 'utils';

import {truncateIsAddress} from 'utils';
import {TradeToolsSection} from 'modules/Dashboard/Wallet/components/TradeToolsSection';
import {useTransak} from 'hooks/useTransak';

import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import {StatusSquare} from '../StatusSquare';
import {BuySellModal} from 'modules/Dashboard/Token/BuySell/index.modal';
import {useUSDFormatter} from 'hooks/utils/useUSDFormatter';
import {useIsBalanceVisible} from 'hooks/useIsBalanceVisible';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import {useAccountsModal} from 'hooks/useAccountsModal';
import CopyButton from '../CopyButton';
import FileCopy from '@material-ui/icons/FileCopy';
import {useWeb3} from 'hooks/useWeb3';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {useDefaultLabelAccount} from 'hooks/useDefaultLabelAccount';

const SwapComponent = React.lazy(() => import('modules/Dashboard/Swap/Swap'));

const useStyles = makeStyles((theme: CremaTheme) => ({
  greenSquare: {
    backgroundColor: theme.palette.success.main,
    height: theme.spacing(8),
    width: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
  },
  usdAmount: {
    fontSize: 32,
    fontWeight: 600,
  },
  usdAmountSign: {
    fontSize: 16,
    fontWeight: 500,
  },
  btnPrimary: {
    color: 'white',
    borderColor: 'white',
    fontFamily: Fonts.BOLD,
    textTransform: 'capitalize',
    width: 106,
    fontSize: 16,
    '&:hover, &:focus': {
      // backgroundColor: theme.palette.primary.dark,
      color: '#F15A2B',
      borderColor: '#F15A2B',
    },
    lineHeight: '16px',
    [theme.breakpoints.up('sm')]: {
      lineHeight: '20px',
    },
    [theme.breakpoints.up('xl')]: {
      lineHeight: '26px',
    },
  },
  backdrop: {
    zIndex: theme.zIndex.modal,
    color: '#fff',
  },
  btnSecondary: {
    color: '#F15A2B',
    borderColor: '#F15A2B',
    fontFamily: Fonts.BOLD,
    textTransform: 'capitalize',
    width: 106,
    fontSize: 16,
    '&:hover, &:focus': {
      // backgroundColor: theme.palette.secondary.dark,
      color: 'white',
      borderColor: 'white',
    },
    lineHeight: '16px',
    [theme.breakpoints.up('sm')]: {
      lineHeight: '20px',
    },
    [theme.breakpoints.up('xl')]: {
      lineHeight: '26px',
    },
  },
}));

interface Props {
  balances: MyBalances[];
  only?: Token;
  loading?: boolean;
  loadingUsd?: boolean;
  address?: string;
  tokenName?: string;
  onShare?: () => void;
  onMakeFavorite?: () => void;
  isFavorite?: boolean;
}

const TotalBalance = (props: Props) => {
  const {
    balances,
    only,
    loading,
    loadingUsd,
    address,
    onMakeFavorite,
    onShare,
    isFavorite,
  } = props;

  const theme = useTheme();
  const {isBalanceVisible, setBalanceIsVisible} = useIsBalanceVisible();
  const [tokens, setTokens] = useState<MyBalances[]>([]);

  const {account} = useWeb3();

  const defaultAccount = useDefaultAccount();
  const defaultAccountLabel = useDefaultLabelAccount();

  const connected = useMemo(() => {
    return account?.toLowerCase() === defaultAccount?.toLowerCase();
  }, [account, defaultAccount]);

  const networkName = useNetwork();
  /* eslint-disable */
  useEffect(() => {
    if (only) {
      const dataFn = balances?.find(
        (e) =>
          e.currency?.address?.toLowerCase() === only.address.toLowerCase(),
      );

      if (!dataFn) {
        setTokens([
          {
            __typename: 'EthereumBalance',
            currency: {
              __typename: 'Currency',
              address: only.address,
              decimals: only.decimals,
              name: only.name || '',
              symbol: only.symbol || '',
              tokenType: 'ERC20',
            },
            network: networkName,
            value: 0,
            valueInUsd: 0,
          },
        ]);
      } else {
        setTokens([
          {
            __typename: 'EthereumBalance',
            currency: {
              __typename: 'Currency',
              address: dataFn.currency?.address ?? '',
              decimals: dataFn.currency?.decimals ?? 18,
              name: dataFn.currency?.name || '',
              symbol: dataFn.currency?.symbol || '',
              tokenType: 'ERC20',
            },
            network: dataFn.network,
            value: dataFn.value ?? 0,
            valueInUsd: dataFn.valueInUsd ?? 0,
          },
        ]);
      }
    } else {
      setTokens(balances);
    }
  }, [only, balances]);

  const usdTotalAmount = useMemo(() => {
    return (
      tokens?.reduce((acc, current) => {
        return (acc += current.valueInUsd || 0);
      }, 0) || 0
    );
  }, [tokens]);

  const usdTotalPercentage = useMemo(() => {
    if (!usdTotalAmount) {
      return;
    }
    const ratios = tokens.map(
      (c) =>
        ((c.valueInUsd || 0) / usdTotalAmount) * (c.price24hPercentage || 0),
    );
    const totalChange = ratios.reduce((acc, curr) => acc + curr);
    return totalChange;
  }, [tokens, usdTotalAmount]);

  const classes = useStyles();

  const onlyTokenValueInUsd = useMemo(() => {
    if (only && tokens.length > 0) {
      return tokens[0].valueInUsd?.toFixed(2);
    }
    return null;
  }, [only, tokens.length]);

  // const onlyTokenValue = useMemo(() => {
  //   if (only && tokens.length > 0) {
  //     return tokens[0].value?.toFixed(4) + ' ' + tokens[0].currency?.symbol;
  //   }
  //   return null;
  // }, [only, tokens.length]);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [showSender, setShowSender] = useState(false);
  const [showReceiver, setShowReceiver] = useState(false);
  const [showSwap, setShowSwap] = useState(false);
  const [showTrade, setShowTrade] = useState(false);

  const handleShowSender = useCallback(() => {
    setShowSender(true);
  }, []);
  const handleShowReceiver = useCallback(() => {
    setShowReceiver(true);
  }, []);
  const handleCloseSender = useCallback(() => {
    setShowSender(false);
  }, []);
  const handleCloseReceiver = useCallback(() => {
    setShowReceiver(false);
  }, []);

  const {init} = useTransak({});

  const handleBuyCrypto = useCallback(() => {
    init();
  }, [init]);

  const handleSwap = useCallback(() => {
    setShowSwap(true);
  }, [init]);

  const handleTrade = useCallback(() => setShowTrade(true), [init]);

  const handleToggleVisibility = useCallback(() => {
    setBalanceIsVisible();
  }, []);

  const handleSwapClose = useCallback(() => {
    setShowSwap(false);
  }, []);

  const handleTradeClose = useCallback(() => {
    setShowTrade(false);
  }, []);

  const {usdFormatter} = useUSDFormatter();

  const accountsModal = useAccountsModal();

  const handleResult = useCallback(() => {
    setShowSender(false);
  }, []);

  const handleShowAccounts = useCallback(() => {
    accountsModal.setShow(true);
  }, [accountsModal]);

  return (
    <>
      <Sender
        open={showSender}
        onClose={handleCloseSender}
        balances={tokens.filter((t) => t.network === networkName)}
        onResult={handleResult}
      />
      <Receiver open={showReceiver} onClose={handleCloseReceiver} />
      <BuySellModal
        networkName={networkName}
        balances={tokens}
        open={showTrade}
        onClose={handleTradeClose}
      />

      <Backdrop className={classes.backdrop} open={showSwap}>
        {/* TODO: transform this in a dialog */}
        <Grid container alignItems='center' justify='center'>
          <Grid item xs={12} sm={4}>
            {showSwap ? <SwapComponent onClose={handleSwapClose} /> : null}
          </Grid>
        </Grid>
      </Backdrop>
      <Box>
        <Grid container spacing={2} alignItems='center' justify='space-between'>
          <Grid item xs={isMobile ? 12 : undefined} sm={4}>
            <Paper>
              <Box p={4}>
                <Grid
                  container
                  alignItems='center'
                  justify='space-between'
                  spacing={4}>
                  <Grid item>
                    <Grid container spacing={2} alignItems='stretch'>
                      <Grid item>
                        {connected ? (
                          <StatusSquare color={theme.palette.success.main} />
                        ) : (
                          <StatusSquare color={theme.palette.grey[500]} />
                        )}
                      </Grid>
                      <Grid item>
                        <Box display='flex' alignItems='center'>
                          <Typography variant='body2'>
                            <span>
                              {isBalanceVisible
                                ? truncateIsAddress(defaultAccountLabel)
                                : '******'}{' '}
                            </span>
                            <CopyButton
                              size='small'
                              copyText={address || ''}
                              tooltip='Copied!'>
                              <FileCopy
                                color='inherit'
                                style={{fontSize: 16}}
                              />
                            </CopyButton>
                            <IconButton
                              onClick={handleShowAccounts}
                              size='small'>
                              <KeyboardArrowDownIcon />
                            </IconButton>
                          </Typography>
                        </Box>

                        <Grid container spacing={2}>
                          <Grid item>
                            <Typography className={classes.usdAmount}>
                              {loadingUsd || loading ? (
                                <Skeleton />
                              ) : (
                                <>
                                  {isBalanceVisible
                                    ? onlyTokenValueInUsd ||
                                      usdFormatter.format(usdTotalAmount)
                                    : '****.**'}
                                </>
                              )}
                            </Typography>
                          </Grid>
                          {usdTotalPercentage && (
                            <Grid item>
                              <Typography
                                style={{
                                  color:
                                    usdTotalPercentage >= 0
                                      ? theme.palette.success.main
                                      : theme.palette.error.main,
                                }}
                                variant={'h6'}>
                                {usdTotalPercentage.toFixed(2)}%
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <IconButton onClick={handleToggleVisibility}>
                      {isBalanceVisible ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={isMobile ? 12 : undefined}>
            <TradeToolsSection
              onSend={handleShowSender}
              onReceive={handleShowReceiver}
              onBuyCrypto={handleBuyCrypto}
              onSwap={handleSwap}
              onTrade={handleTrade}
              onShare={onShare}
              onMakeFavorite={onMakeFavorite}
              isFavorite={isFavorite}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default TotalBalance;
