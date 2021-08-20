import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
  useCallback,
} from 'react';
import GridContainer from '../../../@crema/core/GridContainer';
import {
  Grid,
  Box,
  Fade,
  IconButton,
  Tooltip,
  AppBar,
  Paper,
  Card,
  CardContent,
  Breadcrumbs,
  Typography,
} from '@material-ui/core';
import {Link as RouterLink, useHistory} from 'react-router-dom';

import {RouteComponentProps} from 'react-router-dom';
import AppContextPropsType from 'types/AppContextPropsType';
import {useStyles} from './index.style';
import {AppContext} from '@crema';
import useFetch from 'use-http';
import {useWeb3} from 'hooks/useWeb3';
import {ZRX_API_URL_FROM_NETWORK} from 'shared/constants/AppConst';
import {EthereumNetwork, Fonts, ThemeMode} from 'shared/constants/AppEnums';
import PageTitle from 'shared/components/PageTitle';

import ErrorView from 'modules/Common/ErrorView';

import BuySell from './BuySell';

import TotalBalance from 'shared/components/TotalBalance';
import {Token} from 'types/app';
import {truncateTokenAddress} from 'utils';

import {Skeleton, TabContext, TabPanel} from '@material-ui/lab';
import {useAllBalance} from 'hooks/balance/useAllBalance';
import {useCoingeckoTokenInfo} from 'hooks/useCoingeckoTokenInfo';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import {toggleFavoriteCoin} from 'redux/_ui/actions';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import {TradeHistoryTab} from '../Wallet/Tabs/TradeHistoryTab';
import {MyOrdersTab} from './Tabs/MyOrdersTab';
import {InfoTab} from './Tabs/InfoTab';
import {useTokenInfo} from 'hooks/useTokenInfo';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {AboutDialog} from './AboutDialog';
import {ShareButton} from 'shared/components/ShareButton';
import {CustomTab, CustomTabs} from 'shared/components/Tabs/CustomTabs';
import InfoIcon from '@material-ui/icons/Info';
import { useMulticallTokenBalances } from 'hooks/multicall/useMulticallTokenBalances';
const BinanceTVChartContainer = React.lazy(
  () => import('shared/components/chart/BinanceTVChart/tv_chart'),
);

const BitqueryTVChartContainer = React.lazy(
  () => import('shared/components/chart/BitqueryTVChart/tv_chart'),
);

type Params = {
  address: string;
  networkName: EthereumNetwork;
};

function a11yProps(index: any) {
  return {
    id: `chart-tab-${index}`,
    'aria-controls': `chart-tabpanel-${index}`,
  };
}
interface TabPanelProps {
  children: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

function TabPanelChart(props: TabPanelProps) {
  const {children, value, index, ...other} = props;

  return <>{value === index ? children || null : null}</>;
}

type Props = RouteComponentProps<Params>;

enum ChartSource {
  DEX,
  Binance,
}

const TokenTabsPage: React.FC<Props> = (props) => {
  const {
    match: {params},
  } = props;
  const {address, networkName} = params;
  const history = useHistory();
  const {theme} = useContext<AppContextPropsType>(AppContext);
  const dispatch = useDispatch();
  const favoriteCoins = useSelector<AppState, AppState['ui']['favoriteCoins']>(
    (state) => state.ui.favoriteCoins,
  );

  const searchParams = useMemo(() => {
    return new URLSearchParams(history.location.search);
  }, []);
  const [value, setValue] = React.useState(
    searchParams.get('tab') ?? 'my-orders',
  );
  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    const searchParams = new URLSearchParams(history.location.search);
    searchParams.set('tab', newValue);
    history.push({search: searchParams.toString()});

    setValue(newValue);
  };
  const classes = useStyles(theme);

  const {account: web3Account, chainId} = useWeb3();
  const defaultAccount = useDefaultAccount();
  const account = defaultAccount || web3Account;

  const {data: balances} = useAllBalance(account);

  const {tokenInfo} = useTokenInfo(address);

  const [chartSymbol, setChartSymbol] = useState<string>();

  const [token, setToken] = useState<Token>();

  const [chartSource, setChartSource] = useState<ChartSource>(ChartSource.DEX);

  const {loading, error, data} = useCoingeckoTokenInfo(address, networkName);

  const isDark = theme.palette.type === ThemeMode.DARK;

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
      chartSource === ChartSource.DEX
        ? setChartSymbol(
            `${networkName}:${tokenInfo.symbol?.toUpperCase()}:${
              tokenInfo.address
            }`,
          )
        : setChartSymbol(`${tokenInfo.symbol?.toUpperCase()}USDT`);
    }
  }, [tokenInfo]);

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

  const totalMakerOrders = infoMyMakerOrders.data
    ? infoMyMakerOrders.data.total || 0
    : 0;
  const totalTakerOrders = infoMyTakerOrders.data
    ? infoMyTakerOrders.data.total || 0
    : 0;
  const totalOrders = totalMakerOrders + totalTakerOrders;

  const myOrders = `Open Orders (${totalOrders})`;

  const onSetChartSource = (event: React.ChangeEvent<{}>, newValue: number) => {
    if (newValue === ChartSource.Binance) {
      setChartSource(ChartSource.Binance);
      if (tokenInfo && tokenInfo.symbol) {
        setChartSymbol(`${tokenInfo.symbol?.toUpperCase()}USDT`);
      }
    }
    if (newValue === ChartSource.DEX) {
      setChartSource(ChartSource.DEX);
      if (tokenInfo && tokenInfo.symbol) {
        setChartSymbol(
          `${networkName}:${tokenInfo.symbol?.toUpperCase()}:${
            tokenInfo.address
          }`,
        );
      }
    }
  };

  const [currentTab, setCurrentTab] = useState('trade');

  const handleChangeTab = useCallback(
    (event: React.ChangeEvent<{}>, value: string) => {
      setCurrentTab(value);
    },
    [],
  );

  const [showAboutDialog, setShowAboutDialog] = useState(false);

  const handleCloseAboutDialog = useCallback(() => {
    setShowAboutDialog(false);
  }, []);

  const handleOpenAboutDialog = useCallback(() => {
    setShowAboutDialog(true);
  }, []);

  return (
    <>
      <AboutDialog open={showAboutDialog} onClose={handleCloseAboutDialog} />
      <Box py={4}>
        <Box>
          <Grid container justify='space-between' alignItems='center'>
            <Grid item>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Breadcrumbs aria-label='breadcrumb'>
                    <Typography variant='body2' color='textSecondary'>
                      Home
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                      Trade
                    </Typography>
                  </Breadcrumbs>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2} alignItems='center'>
                    <Grid item>
                      <Typography variant='h5'>Trade</Typography>
                    </Grid>
                    <Grid item>
                      <IconButton onClick={handleOpenAboutDialog} size='small'>
                        <InfoIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container spacing={1}>
                <Grid item>
                  <ShareButton />
                </Grid>
                <Grid item>
                  <Tooltip title='Add to Favorites'>
                    <IconButton
                      aria-label='add favorite coin'
                      color='primary'
                      onClick={onToggleFavorite}>
                      {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <Box mt={4}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              {error && !balances ? (
                <ErrorView message={error.message} />
              ) : (
                <TotalBalance
                  balances={balances}
                  only={token}
                  loading={loading}
                  tokenName={tokenInfo?.name}
                  address={address}
                />
              )}
            </Grid>
            <Grid item xs={12} md={5}>
              <Card>
                <Tabs
                  value={currentTab}
                  onChange={handleChangeTab}
                  indicatorColor='primary'
                  textColor='inherit'
                  variant='fullWidth'>
                  <Tab label='Trade' value='trade' {...a11yProps(0)} />
                  <Tab label='Orders' value='orders' {...a11yProps(1)} />
                </Tabs>
                <CardContent>
                  <BuySell
                    tokenAddress={address}
                    balances={balances}
                    networkName={networkName}
                    tokenInfo={tokenInfo}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={7}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={12} md={12}>
                  <Card>
                    <Tabs
                      value={chartSource}
                      onChange={onSetChartSource}
                      aria-label='chart tabs'
                      indicatorColor='primary'>
                      <Tab
                        label={
                          <Tooltip title='Chart from Decentralized Exchanges'>
                            <span>DEX</span>
                          </Tooltip>
                        }
                        {...a11yProps(0)}
                      />
                      <Tab
                        label={
                          <Tooltip title='Chart from Binance Exchange'>
                            <span>Binance</span>
                          </Tooltip>
                        }
                        {...a11yProps(1)}
                      />
                    </Tabs>
                    <CardContent className={classes.iframeContainer}>
                      <Fade in={true} timeout={1000}>
                        {!chartSymbol ? (
                          <Skeleton variant='rect' height={370} />
                        ) : (
                          <>
                            <TabPanelChart value={chartSource} index={0}>
                              {/* <TVChartContainer
                                    symbol={chartSymbol}
                                    chainId={chainId}
                                    darkMode={isDark}
                                 />*/}

                              <BitqueryTVChartContainer
                                symbol={chartSymbol}
                                darkMode={isDark}
                              />
                            </TabPanelChart>
                            <TabPanelChart value={chartSource} index={1}>
                              <BinanceTVChartContainer
                                symbol={chartSymbol}
                                chainId={chainId}
                                darkMode={isDark}
                              />
                            </TabPanelChart>
                          </>
                        )}
                      </Fade>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <InfoTab error={error} loading={loading} data={data} />
            </Grid>
            <Grid item xs={12}>
              <MyOrdersTab address={address} networkName={networkName} />
            </Grid>
            <Grid item xs={12}>
              <TradeHistoryTab
                address={account}
                token={address}
                enableNetworkChips={false}
                networkName={networkName}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default TokenTabsPage;
