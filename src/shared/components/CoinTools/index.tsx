import React, {useEffect, useState, useCallback} from 'react';
import {Box, Grid, Backdrop} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {EthereumNetwork, Fonts} from 'shared/constants/AppEnums';
import {CremaTheme} from 'types/AppContextPropsType';
import {Token} from 'types/app';
import {MyBalances} from 'types/blockchain';
import {useNetwork} from 'hooks/useNetwork';
// import {tokenSymbolToDisplayString} from 'utils';

import {TradeToolsSection} from 'modules/Dashboard/Wallet/components/TradeToolsSection';
import {useTransak} from 'hooks/useTransak';
import Sender from '../TotalBalance/Sender';
import Receiver from '../TotalBalance/Receiver';
import {BuySellModal} from 'modules/Dashboard/Token/BuySell/index.modal';

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
  enableTrade?: boolean;
  network?: EthereumNetwork;
  disableReceive?: boolean;
  only?: Token;
  loading?: boolean;
  address?: string;
  tokenName?: string;
  onShare?: () => void;
  onMakeFavorite?: () => void;
  isFavorite?: boolean;
  token?: Token;
}

const CoinTools = (props: Props) => {
  const {
    balances,
    only,
    onMakeFavorite,
    onShare,
    isFavorite,
    token,
    network,
    disableReceive,
    enableTrade = true,
  } = props;

  const [tokens, setTokens] = useState<MyBalances[]>([]);

  const net = useNetwork();
  const networkName = network || net;

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

  const classes = useStyles();
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

  /* eslint-disable */
  const handleBuyCrypto = useCallback(() => {
    init();
  }, [init]);

  const handleSwap = useCallback(() => {
    setShowSwap(true);
  }, []);

  const handleTrade = useCallback(() => setShowTrade(true), [init]);

  const handleSwapClose = useCallback(() => {
    setShowSwap(false);
  }, []);

  const handleTradeClose = useCallback(() => {
    setShowTrade(false);
  }, []);

  return (
    <>
      <Sender
        open={showSender}
        onClose={handleCloseSender}
        balances={tokens.filter((t) => t.network === networkName)}
        token={token}
      />
   {enableTrade && <BuySellModal
        networkName={networkName}
        balances={tokens}
        // Commentend this because of buggy situation on click switch tokens, revisit this later
       // tokenInfo={token}
        disableReceive={disableReceive}
       // tokenAddress={token?.address}
        open={showTrade}
        onClose={handleTradeClose}
      />}
      <Receiver open={showReceiver} onClose={handleCloseReceiver} />
      <Backdrop className={classes.backdrop} open={showSwap}>
        <Grid container alignItems='center' justify='center'>
          <Grid item xs={12} sm={4}>
            {showSwap ? <SwapComponent onClose={handleSwapClose} /> : null}
          </Grid>
        </Grid>
      </Backdrop>
      <Box>
        <TradeToolsSection
          onSend={handleShowSender}
          onReceive={handleShowReceiver}
          onBuyCrypto={handleBuyCrypto}
          onSwap={handleSwap}
          onTrade={handleTrade}
          onShare={onShare}
          onMakeFavorite={onMakeFavorite}
          isFavorite={isFavorite}
          isTrade={enableTrade}
        />
      </Box>
    </>
  );
};

export default CoinTools;
