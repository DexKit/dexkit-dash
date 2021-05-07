import React, {useCallback, useEffect, useState, useContext} from 'react';
// import { useHistory, useLocation } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import TotalBalance from 'shared/components/TotalBalance';
import GridContainer from '../../../@crema/core/GridContainer';
import Box from '@material-ui/core/Box';
import SalesState from './SalesState';
import BuySell from './BuySell';
import InfoCard from './InfoCard';
import ProfileCard from './ProfileCard';

import {Link, RouteComponentProps} from 'react-router-dom';
import {MyBalance} from 'types/bitquery/myBalance.interface';
import {CurrencyPair} from '@types';
import {getToken} from 'services/rest/coingecko';
import {CoinDetailCoinGecko} from 'types/coingecko';
import {Fonts, ThemeMode} from 'shared/constants/AppEnums';
import Loader from '@crema/core/Loader';
import AppContextPropsType, {CremaTheme} from 'types/AppContextPropsType';
import {AppContext} from '@crema';
import classes from '*.module.css';
import {makeStyles} from '@material-ui/core';

const TVChartContainer = React.lazy(
  () => import('../../../shared/components/chart/TvChart/tv_chart'),
);

export const marketToString = (currencyPair: CurrencyPair): string => {
  return `${currencyPair.base.toUpperCase()}-${currencyPair.quote.toUpperCase()}`;
};

type TokenParams = {
  address?: string;
};

type TokenProps = RouteComponentProps<TokenParams>;

const useStyles = makeStyles((theme: CremaTheme) => ({
  contractAddress: {
    fontSize: 20,
    [theme.breakpoints.down('xs')]: {
      fontSize: '3.8vw',
    },
  },
}));

const Crypto: React.FC<TokenProps> = (props) => {
  const {
    match: {params},
  } = props;
  const {address} = params;

  const {theme} = useContext<AppContextPropsType>(AppContext);

  const [balances, setBalances] = useState<MyBalance[]>([]);
  const [info, setInfo] = useState<CoinDetailCoinGecko>();

  const [openTrade, setOpenTrade] = useState<boolean>(false);

  const handleModal = useCallback(
    (event: React.SyntheticEvent<HTMLElement, Event>) => {
      console.log('modal event', event);
      // setOpenModal(false);
    },
    [],
  );

  useEffect(
    useCallback(() => {
      if (address) {
        getToken(address).then((data) => {
          if (data) {
            setInfo(data);
          }

          // const _myBalances: MyBalance[] = [{
          //   valueUsd: data.market_data.current_price.usd,
          //   value: data.market_data.current_price.eth,
          //   currency: {
          //     address: data.contract_address,
          //     name: data.name,
          //     tokenType: '',
          //     symbol: data.symbol,
          //     decimals: 18
          //   }
          // }];
          // setBalances(_myBalances);
          // const bitQuery: BitqueryAddress[] = [{
          //   balances: _myBalances as MyBalance[]
          // }]
          // setTotalBalanceData(parseTotalBalance(bitQuery));
        });
      }
    }, []),
    [],
  );

  const classes = useStyles(props);

  const isDark = theme.palette.type === ThemeMode.DARK;

  return (
    <>
      {balances ? (
        <>
          <Box pt={{xl: 4}}>
            <GridContainer>
              <Grid item xs={12} md={12}>
                <Box
                  className={classes.contractAddress}
                  component='h2'
                  color='text.primary'
                  fontSize={{sm: 20, xl: 22}}
                  mb={{xs: 0, sm: 4, xl: 6}}
                  fontFamily={Fonts.LIGHT}>
                  {info?.name} Token{' '}
                  {info?.contract_address
                    ? `- ${info?.contract_address}`
                    : null}
                </Box>
              </Grid>
            </GridContainer>

            <GridContainer>
              <Grid item xs={12} md={5}>
                <Grid item xs={12} md={12}>
                  <TotalBalance balances={balances} />
                </Grid>

                <Grid
                  style={{marginTop: 15}}
                  item
                  xs={12}
                  md={12}
                  key='item-grid-buy-sell'>
                  <BuySell
                    actionButton={($e) => {
                      setOpenTrade(!openTrade);
                    }}
                  />
                </Grid>

                <GridContainer style={{marginTop: 2}}>
                  <Grid item xs={12} sm={6} md={6}>
                    <Link
                      to={`/history/order/token/${address}`}
                      style={{textDecoration: 'none'}}>
                      <InfoCard
                        state={{
                          value: 'My Orders',
                          bgColor: '#0A8FDC',
                          icon: '/assets/images/dashboard/1_monthly_sales.png',
                          id: 1,
                          type: 'Click to Open',
                        }}
                      />
                    </Link>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <Link
                      to={`/history/transaction/token/${address}`}
                      style={{textDecoration: 'none'}}>
                      <InfoCard
                        state={{
                          value: 'Trade history',
                          bgColor: '#9E49E6',
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
                    <TVChartContainer
                      symbol={`${info?.symbol.toUpperCase()}-WETH`}
                      chainId={1}
                      darkMode={isDark}
                    />
                  </Grid>
                </GridContainer>

                <GridContainer style={{marginTop: 15}}>
                  <Grid item xs={12} sm={6} md={6}>
                    <ProfileCard data={info} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <SalesState data={info} />
                  </Grid>
                </GridContainer>
              </Grid>
            </GridContainer>
          </Box>

          {/* <StepModal
          key="step-modal"
          handleClose={handleModal}
          open={modalIsOpen}
        >
          <StepModalContent />
        </StepModal> */}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Crypto;
