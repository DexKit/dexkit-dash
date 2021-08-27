import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {
  Grid,
  Box,
  IconButton,
  Tooltip,
  Card,
  Breadcrumbs,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';

import {RouteComponentProps, useHistory} from 'react-router-dom';
import useFetch from 'use-http';
import {useWeb3} from 'hooks/useWeb3';
import {ZRX_API_URL_FROM_NETWORK} from 'shared/constants/AppConst';
import {EthereumNetwork} from 'shared/constants/AppEnums';

import {Token} from 'types/app';
import {useAllBalance} from 'hooks/balance/useAllBalance';
import {useCoingeckoTokenInfo} from 'hooks/useCoingeckoTokenInfo';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import {toggleFavoriteCoin} from 'redux/_ui/actions';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {useTokenInfo} from 'hooks/useTokenInfo';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {ShareButton} from 'shared/components/ShareButton';

import {ReactComponent as GraphicsIcon} from '../../../../assets/images/icons/stats-chart.svg';
import {ReactComponent as ArrowDownIcon} from '../../../../assets/images/icons/arrow-down.svg';
import {ReactComponent as ArrowLeftIcon} from '../../../../assets/images/icons/arrow-left.svg';
import {useStyles} from './Overview.style';
import BuySell from 'modules/Dashboard/Token/BuySell';
import Charts from 'modules/Dashboard/Token/Charts';
import HistoryTables from 'modules/Dashboard/Token/HistoryTables';
import TokenCard from 'shared/components/TokenCard';
import CoinTools from 'shared/components/CoinTools';
import {TokenAnalytics} from 'modules/Dashboard/Token/Analytics';
import {useTokenPriceUSD} from 'hooks/useTokenPriceUSD';
import {InfoTab} from 'modules/Dashboard/Token/Tabs/InfoTab';

type Params = {
  address: string;
  networkName: EthereumNetwork;
};

type Props = RouteComponentProps<Params>;

const WalletOverviewPage: React.FC<Props> = (props) => {
  const {
    match: {params},
  } = props;
  const {address, networkName} = params;
  const dispatch = useDispatch();
  const favoriteCoins = useSelector<AppState, AppState['ui']['favoriteCoins']>(
    (state) => state.ui.favoriteCoins,
  );
  const {account: web3Account, chainId} = useWeb3();
  const defaultAccount = useDefaultAccount();
  const account: string | undefined = defaultAccount || web3Account || '';
  const {data: balances} = useAllBalance(account);
  const {tokenInfo} = useTokenInfo(address);
  const [token, setToken] = useState<Token>();
  const priceUSD = useTokenPriceUSD(
    address,
    networkName,
    undefined,
    1,
    token?.decimals,
  );
  const {data, loading, error} = useCoingeckoTokenInfo(address, networkName);
  const classes = useStyles();
  const history = useHistory();
  const onToggleFavorite = () => {
    if (token && data) {
      dispatch(toggleFavoriteCoin({...token, ...data}));
    }
  };

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

  const isFavorite = useMemo(() => {
    if (token) {
      return favoriteCoins.find(
        (t) => t.symbol.toLowerCase() === token.symbol.toLowerCase(),
      );
    } else {
      return false;
    }
  }, [favoriteCoins, token]);

  useEffect(() => {
    if (tokenInfo && tokenInfo.symbol) {
      setToken({
        address: address,
        name: tokenInfo.name,
        symbol: tokenInfo.symbol.toUpperCase(),
        decimals: tokenInfo.decimals,
      });
    }
  }, [tokenInfo, address]);

  const infoMyTakerOrders = useFetch(
    `${ZRX_API_URL_FROM_NETWORK(networkName)}/sra/v4/orders`,
  );
  const infoMyMakerOrders = useFetch(
    `${ZRX_API_URL_FROM_NETWORK(networkName)}/sra/v4/orders`,
  );

  useEffect(() => {
    if (account) {
      infoMyTakerOrders.get(`?trader=${account}&takerToken=${address}`);
      infoMyMakerOrders.get(`?trader=${account}&makerToken=${address}`);
    }
  }, [account, address]);

  const handleBack = useCallback(() => history.push(`/dashboard/wallet/`), []);

  return (
    <>
      <Box py={4} className={isMobile ? classes.mobileContainer : ''}>
        <Box>
          <Grid
            container
            justify='space-between'
            alignItems='center'
            spacing={2}>
            <Grid item xs={12}>
              <Breadcrumbs aria-label='breadcrumb'>
                <Typography variant='body2' color='textSecondary'>
                  Wallet
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Overview
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  {tokenInfo?.symbol}
                </Typography>
              </Breadcrumbs>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2} alignItems='center'>
                <Grid item>
                  <IconButton onClick={handleBack} size='small'>
                    <ArrowLeftIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <Typography variant='h5'>Overview</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container justify='space-between' alignItems='center'>
                <Grid item xs={12} sm={4}>
                  {tokenInfo && (
                    <TokenCard
                      icon={''}
                      pair={tokenInfo?.symbol}
                      amount={priceUSD?.priceQuote?.price || 0}
                    />
                  )}
                </Grid>
                <Grid item>
                  <CoinTools balances={balances} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {token && (
                <TokenAnalytics
                  account={account}
                  token={token.address}
                  networkName={networkName}
                />
              )}
            </Grid>
          </Grid>
        </Box>
        <Box mt={4}>
          <Grid container spacing={3}>
            {isMobile ? (
              <>
                <Card>
                  <BuySell
                    tokenAddress={address}
                    balances={balances}
                    networkName={networkName}
                    tokenInfo={tokenInfo}
                  />
                </Card>
                <Grid item xs={12} className={classes.mobileChartsContainer}>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ArrowDownIcon />}
                      aria-controls='panel1a-content'
                      id='panel1a-header'>
                      <Typography>
                        <GraphicsIcon /> Charts
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {tokenInfo && (
                        <Charts
                          chainId={chainId}
                          tokenInfo={tokenInfo}
                          networkName={networkName}
                        />
                      )}
                    </AccordionDetails>
                  </Accordion>
                </Grid>
                <Grid item xs={12}>
                  <HistoryTables
                    account={account}
                    networkName={networkName}
                    address={address}
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12} md={8}>
                  {tokenInfo && (
                    <Charts
                      chainId={chainId}
                      tokenInfo={tokenInfo}
                      networkName={networkName}
                    />
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <BuySell
                      tokenAddress={address}
                      balances={balances}
                      networkName={networkName}
                      tokenInfo={tokenInfo}
                      // Flag to disable receive
                      disableReceive={true}
                    />
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Grid item xs={12}>
                    <InfoTab error={error} loading={loading} data={data} />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <HistoryTables
                    account={account}
                    networkName={networkName}
                    address={address}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default WalletOverviewPage;
