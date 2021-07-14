import React, {useEffect, useState, useContext, useMemo} from 'react';
import GridContainer from '../../../@crema/core/GridContainer';
import {Grid, Box, Link, Fade, IconButton, Tooltip, ButtonGroup, Button} from '@material-ui/core';
import {Link as RouterLink} from 'react-router-dom';

import {RouteComponentProps} from 'react-router-dom';
import AppContextPropsType from 'types/AppContextPropsType';
import {useStyles} from './index.style';
import {AppContext} from '@crema';
import useFetch from 'use-http';
import {useWeb3} from 'hooks/useWeb3';
import { ZRX_API_URL_FROM_NETWORK} from 'shared/constants/AppConst';
import {EthereumNetwork, ThemeMode} from 'shared/constants/AppEnums';
import PageTitle from 'shared/components/PageTitle';
import InfoCard from 'shared/components/InfoCard';
import ErrorView from 'modules/Common/ErrorView';
import CoingeckoProfile from './CoingeckoProfile';
import CoingeckoMarket from './CoingeckoMarket';
import BuySell from './BuySell';

import TotalBalance from 'shared/components/TotalBalance';
import {Token} from 'types/app';
import { truncateTokenAddress} from 'utils';

import {Skeleton} from '@material-ui/lab';
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

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (<>
    
      {value === index ? (children || null) : null}
      </>
  );
}

type Props = RouteComponentProps<Params>;

enum ChartSource{
  DEX,
  Binance
}

const TokenPage: React.FC<Props> = (props) => {
  const {
    match: {params},
  } = props;
  const {address, networkName} = params;

  const {theme} = useContext<AppContextPropsType>(AppContext);
  const dispatch = useDispatch();
  const favoriteCoins = useSelector<AppState, AppState['ui']['favoriteCoins']>(state => state.ui.favoriteCoins);

  const classes = useStyles(theme);

  const {account: web3Account, chainId} = useWeb3();
  const defaultAccount = useDefaultAccount();
  const account = defaultAccount || web3Account;

  const {data: balances} = useAllBalance(account);

  const [chartSymbol, setChartSymbol] = useState<string>();

  const [token, setToken] = useState<Token>();

  const [chartSource, setChartSource] = useState<ChartSource>(ChartSource.DEX);

  const {loading, error, data} = useCoingeckoTokenInfo(address, networkName);

  const isDark = theme.palette.type === ThemeMode.DARK;

  const onToggleFavorite = () => {
    if(token && data){
      dispatch(toggleFavoriteCoin({...token, ...data}));
    }

  }

  const isFavorite = useMemo(()=> { 
    if(token){
      return favoriteCoins.find(t =>  
        t.symbol.toLowerCase() === token.symbol.toLowerCase());
    }else{
      return false;
    }
  }, [favoriteCoins, token] )


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
      :setChartSymbol(`${data.symbol?.toUpperCase()}USDT`);
    }
  }, [data]);

  const infoMyTakerOrders = useFetch(
    `${ZRX_API_URL_FROM_NETWORK(networkName)}/sra/v4/orders` );
  const infoMyMakerOrders = useFetch(
      `${ZRX_API_URL_FROM_NETWORK(networkName)}/sra/v4/orders` );
    
    useEffect(()=> {
      if(account) {
        infoMyTakerOrders.get(`?trader=${account}&takerToken=${address}`)
        infoMyMakerOrders.get(`?trader=${account}&makerToken=${address}`)
      }
    }, [account, address])

  const totalMakerOrders = infoMyMakerOrders.data ? (infoMyMakerOrders.data.total || 0) : 0
  const totalTakerOrders = infoMyTakerOrders.data ? (infoMyTakerOrders.data.total || 0) : 0
  const totalOrders = totalMakerOrders + totalTakerOrders;

  const myOrders = `My Orders (${totalOrders})`;

  const tradeHistory = 'My Trade History';
  const onSetChartSource = (event: React.ChangeEvent<{}>, newValue: number) => {
    if(newValue === ChartSource.Binance){
      setChartSource(ChartSource.Binance)
      if (data && data.symbol) {
         setChartSymbol(`${data.symbol?.toUpperCase()}USDT`)
      }
    }
    if(newValue === ChartSource.DEX){
      setChartSource(ChartSource.DEX)
      if (data && data.symbol) {
        setChartSymbol(`${data.symbol?.toUpperCase()}-USD`)
      }
    }

  }


  return (
    <>
      <Box pt={{xl: 4}}>
         <Box className={classes.title}>
          <Box>
              {data && (
                <PageTitle
                  title={{name: data.name}}
                  subtitle={{name: truncateTokenAddress(address), hasCopy: address}}
                  icon={address}
                  network={networkName}
                />
              )}
            </Box>
              <Box>
                <Tooltip title="Add to Favorites">
                  <IconButton aria-label="add favorite coin" color="primary" onClick={onToggleFavorite}>
                    {isFavorite ?  <FavoriteIcon /> : <FavoriteBorderIcon/>}
                  </IconButton>
                </Tooltip>
              </Box>
         </Box>


        <GridContainer>
          <Grid item xs={12} md={5}>
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

            <Grid item xs={12} md={12} style={{marginTop: 10}}>
            {/*<BuySell tokenAddress={address} balances={balances} networkName={networkName}/>*/}
            </Grid>

            <GridContainer style={{marginTop: 2}}>
            {account && <Grid item xs={12} sm={6} md={6}>
                <Box className='card-hover'>
                  <Link
                    className={classes.btnPrimary}
                    component={RouterLink}
                    to={`/${networkName}/history/myorders/list/${address}`}
                    style={{textDecoration: 'none'}}>
                    <InfoCard
                      state={{
                        value: myOrders,
                        bgColor: theme.palette.sidebar.bgColor,
                        icon: '/assets/images/dashboard/1_monthly_sales.png',
                        id: 1,
                        type: 'Click to Open',
                      }}
                    />
                  </Link>
                </Box>
              </Grid>}
            {account && <Grid item xs={12} sm={6} md={6}>
                <Box className='card-hover'>
                  <Link
                    className={classes.btnSecondary}
                    component={RouterLink}
                    to={`/${networkName}/history/trade/list/${account}/token/${address}`}
                    style={{textDecoration: 'none'}}>
                    <InfoCard
                      state={{
                        value: tradeHistory,
                        bgColor: theme.palette.sidebar.bgColor,
                        icon: '/assets/images/dashboard/1_monthly_sales.png',
                        id: 2,
                        type: 'Click to Open',
                      }}
                    />
                  </Link>
                </Box>
              </Grid>}
            </GridContainer>
          </Grid>

          <Grid item xs={12} md={7}>
            <GridContainer>
             
                <Grid  container xs={12} sm={12} md={12} style={{padding:'0px'}} justify="flex-end"  direction="row">
                  <Tabs value={chartSource} onChange={onSetChartSource} aria-label="chart tabs" indicatorColor="primary">
                             <Tab label={<><Tooltip title={'Chart from Decentralized Exchanges'}><>DEX</></Tooltip> </>} {...a11yProps(0)} /> 
                             <Tab label={<><Tooltip title={'Chart from Binance Exchange'}><>Binance</></Tooltip> </>} {...a11yProps(1)} />
                        </Tabs>
                </Grid>
                <Fade in={true} timeout={1000}>
                <Grid style={{height: '450px'}} item xs={12} sm={12} md={12}>
                  {!chartSymbol ? (
                    <Skeleton variant='rect' height={370} />
                  ) : (
                    <>
                    <TabPanel value={chartSource} index={0}>
                        <TVChartContainer
                          symbol={chartSymbol}
                          chainId={chainId}
                          darkMode={isDark}
                        />
                      </TabPanel>
                      <TabPanel value={chartSource} index={1}>
                          <BinanceTVChartContainer 
                          symbol={chartSymbol}
                          chainId={chainId}
                          darkMode={isDark}/>
   
                      </TabPanel>



                    </>
                  )}
                </Grid>
              </Fade>
            </GridContainer>

            <GridContainer style={{marginTop: 15}}>
              <Grid item xs={12} sm={6} md={6}>
                {error ? (
                  <ErrorView message={error.message} />
                ) : (
                  <CoingeckoProfile data={data} loading={loading} />
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                {error ? (
                  <ErrorView message={error.message} />
                ) : (
                  <CoingeckoMarket data={data} loading={loading} />
                )}
              </Grid>
            </GridContainer>
          </Grid>
        </GridContainer>
      </Box>
    </>
  );
};

export default TokenPage;
