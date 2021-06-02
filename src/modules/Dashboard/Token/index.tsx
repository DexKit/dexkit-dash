import React, {useEffect, useState, useContext} from 'react';
import GridContainer from '../../../@crema/core/GridContainer';
import {Grid, Box, Link} from '@material-ui/core';

import {RouteComponentProps} from 'react-router-dom';
import AppContextPropsType, {CremaTheme} from 'types/AppContextPropsType';
import {useStyles} from './index.style';
import {AppContext} from '@crema';
import useFetch from 'use-http';
import {useWeb3} from 'hooks/useWeb3';
import {CoinDetailCoinGecko} from 'types/coingecko/coin.interface';
import {COINGECKO_CONTRACT_URL, ZRX_API_URL} from 'shared/constants/AppConst';
import {ThemeMode} from 'shared/constants/AppEnums';
import PageTitle from 'shared/components/PageTitle';
import InfoCard from 'shared/components/InfoCard';
import LoadingView from 'modules/Common/LoadingView';
import ErrorView from 'modules/Common/ErrorView';
import CoingeckoProfile from './CoingeckoProfile';
import CoingeckoMarket from './CoingeckoMarket';
import BuySell from './BuySell';
import {useNetwork} from 'hooks/useNetwork';
import TotalBalance from 'shared/components/TotalBalance';
import {useBalance} from 'hooks/balance/useBalance';
import {Token} from 'types/app';
import {truncateAddress} from 'utils';
import {useBlokchain} from 'hooks/useBlokchain';
import {useChainId} from 'hooks/useChainId';

const TVChartContainer = React.lazy(
  () => import('shared/components/chart/TvChart/tv_chart'),
);

type Params = {
  address: string;
};

type Props = RouteComponentProps<Params>;

const TokenPage: React.FC<Props> = (props) => {
  const {
    match: {params},
  } = props;
  const {address} = params;

  const {theme} = useContext<AppContextPropsType>(AppContext);

  const networkName = useNetwork();

  const {currentChainId} = useChainId();

  const classes = useStyles(theme);

  const {account, chainId} = useWeb3();

  const {data: balances} = useBalance();

  const [chartSymbol, setChartSymbol] = useState<string>();

  const [token, setToken] = useState<Token>();

  const {loading, error, data} = useFetch<CoinDetailCoinGecko>(`${COINGECKO_CONTRACT_URL}/${address}`, {}, [address]);

  const isDark = theme.palette.type === ThemeMode.DARK;

  useEffect(() => {
    if (data && data.symbol) {
      setToken({
        address: address,
        name: data.name,
        symbol: data.symbol.toUpperCase(),
        decimals: 0,
      });

      if (data.symbol?.toUpperCase() === 'WETH') {
        setChartSymbol(`${data.symbol?.toUpperCase()}-USD`);
      } else {
        setChartSymbol(`${data.symbol?.toUpperCase()}-USD`);
      }
    }
  }, [data]);

  const infoMyOrders = useFetch(
    `${ZRX_API_URL(currentChainId)}/sra/v4/orders`,
    [address],
  );

  const infoTradeHistory = useFetch(
    `${ZRX_API_URL(currentChainId)}/sra/v4/orders?makerToken=${address}`,
    [address],
  );

  const myOrders =
    'My Orders' +
    (infoMyOrders.data ? ' (' + infoMyOrders.data.total + ')' : '');

  const tradeHistory =
    'Trade History' +
    (infoTradeHistory.data ? ' (' + infoTradeHistory.data.total + ')' : '');

  return (
    <>
      <Box pt={{xl: 4}}>
        {data && (
          <PageTitle
            title={{name: data.name}}
            subtitle={{name: truncateAddress(address), hasCopy: address}}
            icon={address}
          />
        )}

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
              <BuySell tokenAddress={address} balances={balances} />
            </Grid>

            <GridContainer style={{marginTop: 2}}>
              <Grid item xs={12} sm={6} md={6}>
                <Box className='card-hover'>
                  <Link
                    className={classes.btnPrimary}
                    href={`/${networkName}/history/myorders/list/${address}`}
                    style={{textDecoration: 'none'}}>
                    <InfoCard
                      state={{
                        value: myOrders,
                        bgColor: theme.palette.primary.main,
                        icon: '/assets/images/dashboard/1_monthly_sales.png',
                        id: 1,
                        type: 'Click to Open',
                      }}
                    />
                  </Link>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Box className='card-hover'>
                  <Link
                    className={classes.btnSecondary}
                    href={`/${networkName}/history/trade/list/${address}`}
                    style={{textDecoration: 'none'}}>
                    <InfoCard
                      state={{
                        value: tradeHistory,
                        bgColor: theme.palette.secondary.main,
                        icon: '/assets/images/dashboard/1_monthly_sales.png',
                        id: 2,
                        type: 'Click to Open',
                      }}
                    />
                  </Link>
                </Box>
              </Grid>
            </GridContainer>
          </Grid>

          <Grid item xs={12} md={7}>
            <GridContainer>
              <Grid style={{height: '400px'}} item xs={12} sm={12} md={12}>
                {!chartSymbol ? (
                  <LoadingView />
                ) : (
                  <TVChartContainer
                    symbol={chartSymbol}
                    chainId={chainId}
                    darkMode={isDark}
                  />
                )}
              </Grid>
            </GridContainer>

            <GridContainer style={{marginTop: 15}}>
              <Grid item xs={12} sm={6} md={6}>
                {loading ? (
                  <LoadingView />
                ) : error ? (
                  <ErrorView message={error.message} />
                ) : (
                  <CoingeckoProfile data={data} />
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                {loading ? (
                  <LoadingView />
                ) : error ? (
                  <ErrorView message={error.message} />
                ) : (
                  <CoingeckoMarket data={data} />
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
