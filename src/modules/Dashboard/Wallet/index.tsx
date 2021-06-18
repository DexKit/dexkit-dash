import React, {useContext, useEffect, useState} from 'react';

import {Grid, Box, Divider, Fade} from '@material-ui/core';

import {RouteComponentProps, useHistory} from 'react-router-dom';
import AppSelect from '@crema/core/AppSelect';
import GridContainer from '@crema/core/GridContainer';
import AppCard from '@crema/core/AppCard';

import {useIntl} from 'react-intl';

import InfoCard from './InfoCard';

import DefiCoins, {CoinsProps} from './DefiCoins';

import PageTitle from 'shared/components/PageTitle';
import {Link} from 'react-router-dom';
import {useWeb3} from 'hooks/useWeb3';
import TotalBalance from 'shared/components/TotalBalance';
import ErrorView from 'modules/Common/ErrorView';
import AssetTable from './AssetTable';
import {useNetwork} from 'hooks/useNetwork';
import Transak from 'shared/components/Transak';
import {useBalanceChart} from 'hooks/balance/useBalanceChart';
import AssetChart from './AssetChart';
import {useDefi} from 'hooks/useDefi';
import {truncateAddress} from 'utils';
import {useStyles} from './index.style';
import AppContextPropsType from 'types/AppContextPropsType';
import {AppContext} from '@crema';
import {Skeleton} from '@material-ui/lab';
import { useAllBalance } from 'hooks/balance/useAllBalance';
import { useDefaultAccount } from 'hooks/useDefaultAccount';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { setDefaultAccount } from 'redux/_ui/actions';
import { useDispatch } from 'react-redux';



type Params = {
  account: string;
};

type Props = RouteComponentProps<Params>;

const Wallet: React.FC<Props> = (props) => {
  const {messages} = useIntl();
  const {
    match: {params},
  } = props;
  const {account: urlAccount} = params;
  const history = useHistory();

  const defaultAccount = useDefaultAccount();
  const dispatch = useDispatch()
  const {account: web3Account} = useWeb3();
  const account = defaultAccount || web3Account;
  
  const {defiBalance} = useDefi(account);
  const {loading, error, data} = useAllBalance(defaultAccount);
  const {
    loading: loadingChart,
    error: errorChart,
    data: dataChart,
    handleSelectDay,
    handleSelectToken,
  } = useBalanceChart(data);

  useEffect(() => {
    if(urlAccount && Web3Wrapper.isAddress(urlAccount) && defaultAccount !== urlAccount){
      history.push(`/dashboard/wallet/${urlAccount}`)
      dispatch(setDefaultAccount(urlAccount))
    }
    if(!urlAccount && defaultAccount){
      history.push(`/dashboard/wallet/${defaultAccount}`)
    }

  }, [urlAccount, defaultAccount])



  const networkName = useNetwork();

  const classes = useStyles();

  const {theme} = useContext<AppContextPropsType>(AppContext);

  return (
    <Box pt={{xl: 4}}>
          <PageTitle
            breadcrumbs={{
              history: [
                {url: '/', name: 'Dashboard'},
                {url: '/dashboard/wallet', name: 'Wallet'},
              ],
              active: {name: `${truncateAddress(defaultAccount)}`, hasCopy: account},
            }}
            title={{name: 'Wallet'}}
          />
      <GridContainer>
        <Grid item xs={12} md={6}>
          <Grid item xs={12} md={12}>
            {error ? (
              <ErrorView message={error.message} />
            ) : (
              <TotalBalance balances={data} loading={loading} />
            )}
          </Grid>

          <Grid item xs={12} md={12} style={{marginTop: 15}}>
            {error ? (
              <ErrorView message={error.message} />
            ) : (
              <AssetTable balances={data} loading={loading} />
            )}
          </Grid>

          <GridContainer style={{marginTop: 2}}>
            <Grid item xs={12} sm={6} md={6}>
              <Box className='card-hover'>
                <Link
                  className={classes.btnPrimary}
                  to={`/${networkName}/history/trade/list/${account}`}
                  style={{textDecoration: 'none'}}>
                  <InfoCard
                    state={{
                      value: 'Trade History',
                      bgColor: theme.palette.sidebar.bgColor,
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
                  to={`/${networkName}/history/transfer/list/${account}`}
                  style={{textDecoration: 'none'}}>
                  <InfoCard
                    state={{
                      value: 'Transfers History',
                      bgColor: theme.palette.sidebar.bgColor,
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

        <Grid item xs={12} md={6}>
          <Grid item xs={12} md={12} style={{paddingLeft: 0, paddingRight: 0}}>
            <Fade in={true} timeout={1000}>
              {loading && loadingChart ? (
                <Skeleton variant='rect' width='100%' height={350} />
              ) : errorChart ? (
                <ErrorView message={errorChart.message} />
              ) : (
                <AppCard
                  style={{paddingLeft: 0, paddingRight: 0, paddingTop: 5}}>
                  <Box
                    paddingLeft='5px'
                    paddingRight='5px'
                    display='flex'
                    justifyContent={'space-between'}>
                    <AppSelect
                      menus={data.map((e) => e.currency?.symbol)}
                      defaultValue={'ETH'}
                      onChange={(e) => handleSelectToken(e)}
                    />

                    <AppSelect
                      menus={[
                        '7 days',
                        '15 days',
                        '30 days',
                        '60 days',
                        '90 days',
                        '180 days',
                      ]}
                      defaultValue={'7 days'}
                      onChange={(e) => {
                        handleSelectDay(Number(e.split(' ')[0]));
                      }}
                    />

                    <Transak />
                  </Box>

                  <Divider style={{marginTop: 5}} />

                  <Box>
                    <Grid item xs={12} md={12} xl={12} style={{padding: 10}}>
                      <AssetChart data={dataChart} />
                    </Grid>
                  </Box>
                </AppCard>
              )}
            </Fade>
          </Grid>
          {
            <Grid item xs={12} md={12} style={{marginTop: 15}}>
              <DefiCoins {...defiBalance} />
            </Grid>
          }
        </Grid>
      </GridContainer>
    </Box>
  );
};

export default Wallet;
