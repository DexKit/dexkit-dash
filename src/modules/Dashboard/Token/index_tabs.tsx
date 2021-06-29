import React, { useEffect, useState, useContext, useMemo } from 'react';
import GridContainer from '../../../@crema/core/GridContainer';
import { Grid, Box, Fade, IconButton, Tooltip,  AppBar, Paper } from '@material-ui/core';
import { Link as RouterLink, useHistory } from 'react-router-dom';

import { RouteComponentProps } from 'react-router-dom';
import AppContextPropsType from 'types/AppContextPropsType';
import { useStyles } from './index.style';
import { AppContext } from '@crema';
import useFetch from 'use-http';
import { useWeb3 } from 'hooks/useWeb3';
import { ZRX_API_URL_FROM_NETWORK } from 'shared/constants/AppConst';
import { EthereumNetwork, ThemeMode } from 'shared/constants/AppEnums';
import PageTitle from 'shared/components/PageTitle';

import ErrorView from 'modules/Common/ErrorView';
import CoingeckoProfile from './CoingeckoProfile';
import CoingeckoMarket from './CoingeckoMarket';
import BuySell from './BuySell';

import TotalBalance from 'shared/components/TotalBalance';
import { Token } from 'types/app';
import { truncateTokenAddress } from 'utils';

import { Skeleton, TabContext, TabPanel } from '@material-ui/lab';
import { useAllBalance } from 'hooks/balance/useAllBalance';
import { useCoingeckoTokenInfo } from 'hooks/useCoingeckoTokenInfo';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import { toggleFavoriteCoin } from 'redux/_ui/actions';
import { useDefaultAccount } from 'hooks/useDefaultAccount';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import InfoIcon from '@material-ui/icons/Info';
import { TradeHistoryTab } from '../Wallet/Tabs/TradeHistoryTab';
import { MyOrdersTab } from './Tabs/MyOrdersTab';
import { InfoTab } from './Tabs/InfoTab';

const TVChartContainer = React.lazy(
  () => import('shared/components/chart/TvChart/tv_chart'),
);

const BinanceTVChartContainer = React.lazy(
  () => import('shared/components/chart/BinanceTVChart/tv_chart'),
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
  const { children, value, index, ...other } = props;

  return (<>

    {value === index ? (children || null) : null}
  </>
  );
}

type Props = RouteComponentProps<Params>;

enum ChartSource {
  DEX,
  Binance
}

const TokenTabsPage: React.FC<Props> = (props) => {
  const {
    match: { params },
  } = props;
  const { address, networkName } = params;
  const history = useHistory();
  const { theme } = useContext<AppContextPropsType>(AppContext);
  const dispatch = useDispatch();
  const favoriteCoins = useSelector<AppState, AppState['ui']['favoriteCoins']>(state => state.ui.favoriteCoins);

  let searchParams = useMemo(() => { return new URLSearchParams(history.location.search) }, []);
  const [value, setValue] = React.useState(searchParams.get('tab') ?? 'trade');
  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    let searchParams = new URLSearchParams(history.location.search);
    searchParams.set('tab', newValue);
    history.push({ search: searchParams.toString() });

    setValue(newValue);
  };
  const classes = useStyles(theme);

  const { account: web3Account, chainId } = useWeb3();
  const defaultAccount = useDefaultAccount();
  const account = defaultAccount || web3Account;

  const { data: balances } = useAllBalance(account);

  const [chartSymbol, setChartSymbol] = useState<string>();

  const [token, setToken] = useState<Token>();

  const [chartSource, setChartSource] = useState<ChartSource>(ChartSource.DEX);

  const { loading, error, data } = useCoingeckoTokenInfo(address, networkName);

  const isDark = theme.palette.type === ThemeMode.DARK;

  const onToggleFavorite = () => {
    if (token && data) {
      dispatch(toggleFavoriteCoin({ ...token, ...data }));
    }

  }

  const isFavorite = useMemo(() => {
    if (token) {
      return favoriteCoins.find(t =>
        t.symbol.toLowerCase() === token.symbol.toLowerCase());
    } else {
      return false;
    }
  }, [favoriteCoins, token])


  useEffect(() => {
    if (data && data.symbol) {
      setToken({
        address: address,
        name: data.name,
        symbol: data.symbol.toUpperCase(),
        decimals: 0,
      });
      chartSource === ChartSource.DEX ?
        setChartSymbol(`${data.symbol?.toUpperCase()}-USD`)
        : setChartSymbol(`${data.symbol?.toUpperCase()}USDT`);
    }
  }, [data]);

  const infoMyTakerOrders = useFetch(
    `${ZRX_API_URL_FROM_NETWORK(networkName)}/sra/v4/orders`);
  const infoMyMakerOrders = useFetch(
    `${ZRX_API_URL_FROM_NETWORK(networkName)}/sra/v4/orders`);

  useEffect(() => {
    if (account) {
      infoMyTakerOrders.get(`?trader=${account}&takerToken=${address}`)
      infoMyMakerOrders.get(`?trader=${account}&makerToken=${address}`)
    }
  }, [account, address])

  const totalMakerOrders = infoMyMakerOrders.data ? (infoMyMakerOrders.data.total || 0) : 0
  const totalTakerOrders = infoMyTakerOrders.data ? (infoMyTakerOrders.data.total || 0) : 0
  const totalOrders = totalMakerOrders + totalTakerOrders;

  const myOrders = `Open Orders (${totalOrders})`;

  const onSetChartSource = (event: React.ChangeEvent<{}>, newValue: number) => {
    if (newValue === ChartSource.Binance) {
      setChartSource(ChartSource.Binance)
      if (data && data.symbol) {
        setChartSymbol(`${data.symbol?.toUpperCase()}USDT`)
      }
    }
    if (newValue === ChartSource.DEX) {
      setChartSource(ChartSource.DEX)
      if (data && data.symbol) {
        setChartSymbol(`${data.symbol?.toUpperCase()}-USD`)
      }
    }

  }


  return (
    <>
      <Box pt={{ xl: 4 }}>
        <Box className={classes.title}>
          <Box>
            {data && (
              <PageTitle
                title={{ name: data.name }}
                subtitle={{ name: truncateTokenAddress(address), hasCopy: address }}
                icon={address}
                network={networkName}
              />
            )}
          </Box>
          <Box>
            <Tooltip title="Add to Favorites">
              <IconButton aria-label="add favorite coin" color="primary" onClick={onToggleFavorite}>
                {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>


        <GridContainer pt={0}>
          <Grid item xs={12} md={12} style={{ marginTop: 10 }}>
            <Grid item xs={12} md={12}>
              {error ? (
                <ErrorView message={error.message} />
              ) : (
                <TotalBalance
                  balances={balances}
                  only={token}
                  loading={loading}
                />
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} md={12}>
            <Box mt={2}>
              <Paper square>
                <TabContext value={value}>
                  <AppBar position="static" color='transparent'>
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      variant="fullWidth"
                      indicatorColor="primary"
                      textColor="primary"
                      aria-label="wallet tabs"
                    >
                      <Tab value="trade" icon={<CompareArrowsIcon />} label="Trade" />   
                      <Tab value="my-orders" icon={<ShoppingCartIcon/>} label={myOrders} />
                      <Tab value="trade-history" icon={<SwapHorizontalCircleIcon />} label="Trade History" />
                      <Tab value="info" icon={<InfoIcon />} label="Info" />
                    </Tabs>
                  </AppBar>
                  <TabPanel value="trade">
                  <GridContainer>
                    <Grid item xs={12} md={5} style={{ marginTop: 10 }}>
                      <BuySell tokenAddress={address} balances={balances} networkName={networkName} />
                    </Grid>
                    <Grid item xs={12} md={7}>
                      <GridContainer>
                        <Grid container xs={12} sm={12} md={6} style={{ padding: '0px' }} justify="flex-end" direction="row">
                          <Tabs value={chartSource} onChange={onSetChartSource} aria-label="chart tabs" indicatorColor="primary">
                            <Tab label={<><Tooltip title={'Chart from Decentralized Exchanges'}><>DEX</></Tooltip> </>} {...a11yProps(0)} />
                            <Tab label={<><Tooltip title={'Chart from Binance Exchange'}><>Binance</></Tooltip> </>} {...a11yProps(1)} />
                          </Tabs>
                        </Grid>
                        <Fade in={true} timeout={1000}>
                          <Grid style={{ height: '450px' }} item xs={12} sm={12} md={12}>
                            {!chartSymbol ? (
                              <Skeleton variant='rect' height={370} />
                            ) : (
                              <>
                                <TabPanelChart value={chartSource} index={0}>
                                  <TVChartContainer
                                    symbol={chartSymbol}
                                    chainId={chainId}
                                    darkMode={isDark}
                                  />
                                </TabPanelChart>
                                <TabPanelChart value={chartSource} index={1}>
                                  <BinanceTVChartContainer
                                    symbol={chartSymbol}
                                    chainId={chainId}
                                    darkMode={isDark} />

                                </TabPanelChart>
                              </>
                            )}
                          </Grid>
                        </Fade>
                      </GridContainer>
                    </Grid>
                    </GridContainer>
                  </TabPanel>
                  <TabPanel value="info">
                      <InfoTab error={error} loading={loading} data={data}/>
                  </TabPanel>
                  <TabPanel value="my-orders">
                    <MyOrdersTab  address={address} networkName={networkName} />
                  </TabPanel>
                  <TabPanel value="trade-history">
                      <TradeHistoryTab address={account} token={address} enableNetworkChips={false}/>
                  </TabPanel>

                </TabContext>
              </Paper>
            </Box>
          </Grid>






        </GridContainer>
      </Box>
    </>
  );
};

export default TokenTabsPage;
