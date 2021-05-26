import React, {useCallback, useEffect, useState, useContext} from 'react';
import GridContainer from '../../../@crema/core/GridContainer';
import {Grid, Box, Link} from '@material-ui/core';

import {RouteComponentProps} from 'react-router-dom';
import AppContextPropsType, {CremaTheme} from 'types/AppContextPropsType';
import {useStyles} from './index.style';
import {AppContext} from '@crema';
import useFetch from 'use-http';
import {useWeb3} from 'hooks/useWeb3';
import {CoinDetailCoinGecko} from 'types/coingecko/coin.interface';
import {COINGECKO_CONTRACT_URL} from 'shared/constants/AppConst';
import {ThemeMode} from 'shared/constants/AppEnums';
import PageTitle from 'shared/components/PageTitle';
import InfoCard from 'shared/components/InfoCard';
import LoadingView from 'modules/Common/LoadingView';
import ErrorView from 'modules/Common/ErrorView';
import CoingeckoProfile from './CoingeckoProfile';
import CoingeckoMarket from './CoingeckoMarket';
import BuySell from './BuySell';

const TVChartContainer = React.lazy(
  () => import('shared/components/chart/TvChart/tv_chart'),
);

type Params = {
  address: string;
};

type Props = RouteComponentProps<Params>;

const Token: React.FC<Props> = (props) => {
  const {
    match: {params},
  } = props;
  const {address} = params;

  const {theme} = useContext<AppContextPropsType>(AppContext);

  const classes = useStyles(theme);

  const {account, chainId} = useWeb3();

  const [chartSymbol, setChartSymbol] = useState<string>();

  const {loading, error, data} = useFetch<CoinDetailCoinGecko>(
    `${COINGECKO_CONTRACT_URL}/${address}`,
    {},
    [address],
  );

  const isDark = theme.palette.type === ThemeMode.DARK;

  useEffect(() => {
    if (data && data.symbol) {
      if (data.symbol?.toUpperCase() == 'WETH') {
        setChartSymbol(`${data.symbol?.toUpperCase()}-USDT`);
      } else {
        setChartSymbol(`${data.symbol?.toUpperCase()}-WETH`);
      }
    }
  }, [data]);

  return (
    <>
      <Box pt={{xl: 4}}>
        <PageTitle
          history={[{url: '/dashboard/overview', name: 'Dashboard'}]}
          active={'Token'}
          title={`Token`}
          address={address}
        />

        <GridContainer>
          <Grid item xs={12} md={5}>
            <Grid item xs={12} md={12}>
              {/* <TotalBalance balances={balances} only={} />  */}
            </Grid>

            <Grid item xs={12} md={12}>
              <BuySell tokenAddress={address} />
            </Grid>

            <GridContainer style={{marginTop: 2}}>
              <Grid item xs={12} sm={6} md={6}>
                <Link
                  href={`/history/order/token/${address}`}
                  style={{textDecoration: 'none'}}>
                  <InfoCard
                    state={{
                      value: 'My Orders',
                      bgColor: theme.palette.primary.main,
                      icon: '/assets/images/dashboard/1_monthly_sales.png',
                      id: 1,
                      type: 'Click to Open',
                    }}
                  />
                </Link>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Link
                  href={`/history/transaction/token/${address}`}
                  style={{textDecoration: 'none'}}>
                  <InfoCard
                    state={{
                      value: 'Trade history',
                      bgColor: theme.palette.secondary.main,
                      icon: '/assets/images/dashboard/1_monthly_sales.png',
                      id: 2,
                      type: 'Click to Open',
                    }}
                  />
                </Link>
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

export default Token;
