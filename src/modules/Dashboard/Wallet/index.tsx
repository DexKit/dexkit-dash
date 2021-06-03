import React, { useState } from 'react';

import { Grid, Box, Divider } from '@material-ui/core';

import AppSelect from '@crema/core/AppSelect';
import GridContainer from '@crema/core/GridContainer';
import AppCard from '@crema/core/AppCard';

import { useIntl } from 'react-intl';

import InfoCard from './InfoCard'

import DefiCoins, { CoinsProps } from './DefiCoins';

import PageTitle from 'shared/components/PageTitle';
import { Link } from 'react-router-dom';
import { useWeb3 } from 'hooks/useWeb3';
import { useBalance } from 'hooks/balance/useBalance';
import TotalBalance from 'shared/components/TotalBalance';
import LoadingView from 'modules/Common/LoadingView';
import ErrorView from 'modules/Common/ErrorView';
import AssetTable from './AssetTable';
import { useNetwork } from 'hooks/useNetwork';
import Transak from 'shared/components/Transak';
import { useBalanceChart } from 'hooks/balance/useBalanceChart';
import AssetChart from './AssetChart';
import { useDefi } from 'hooks/useDefi';
import { truncateAddress } from 'utils';


interface Props { }

const Wallet: React.FC<Props> = (props) => {
  const { messages } = useIntl();
  const { account } = useWeb3();
  const { defiBalance } = useDefi(account);
  const { loading, error, data } = useBalance();
  const { loading: loadingChart, error: errorChart, data: dataChart, handleSelectDay, handleSelectToken } = useBalanceChart();

  const networkName = useNetwork();

  return (
    <Box pt={{ xl: 4 }}>

      <PageTitle
        breadcrumbs={{
          history: [
            {url:'/' , name: 'Dashboard'},
            {url:'/dashboard/wallet', name: 'Wallet'}
          ],
          active: {name: `${truncateAddress(account)}`, hasCopy: account}
        }}
        title={{name: 'Wallet'}}
      />

      <GridContainer>

        <Grid item xs={12} md={6}>
          <Grid item xs={12} md={12}>
            {
              loading ? <LoadingView /> : error ? <ErrorView message={error.message} /> : (
                <TotalBalance balances={data} />
              )
            }
          </Grid>

          <Grid item xs={12} md={12} style={{ marginTop: 15 }}>
            {
              loading ? <LoadingView /> : error ? <ErrorView message={error.message} /> : (
                <AssetTable balances={data} />
              )
            }
          </Grid>

          <GridContainer style={{marginTop: 2}}>
            <Grid item xs={12} sm={6} md={6}>
              <Link to={`/${networkName}/history/order/list/${account}`} style={{textDecoration: 'none'}}>
                <InfoCard state={{
                  value: "Order history",
                  bgColor: "#ff7149",
                  icon: "/assets/images/dashboard/1_monthly_sales.png",
                  id: 1,
                  type: "Click to Open",
                }} />
              </Link>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <Link to={`/${networkName}/history/transaction/list/${account}`} style={{textDecoration: 'none'}}>
                <InfoCard state={{
                  value: "Transaction history",
                  bgColor: "#420e00",
                  icon: "/assets/images/dashboard/1_monthly_sales.png",
                  id: 2,
                  type: "Click to Open",
                }} />
              </Link>
            </Grid>
          </GridContainer>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid item xs={12} md={12} style={{ paddingLeft: 0, paddingRight: 0, }}>
            {
              (loading && loadingChart) ? <LoadingView /> : errorChart ? <ErrorView message={errorChart.message} /> : (
                <AppCard style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 5 }}>
                  <Box paddingLeft="5px" paddingRight="5px" display="flex" justifyContent={'space-between'}>
                    <AppSelect
                      menus={data.map(e => e.currency?.symbol)}
                      defaultValue={'ETH'}
                      onChange={(e) => handleSelectToken(e)}/>

                    <AppSelect
                      menus={['7 days', '15 days', '30 days', '60 days', '90 days', '180 days']}
                      defaultValue={'7 days'}
                      onChange={(e) => { handleSelectDay(Number(e.split(' ')[0])) }}
                    />

                    <Transak />
                  </Box>

                  <Divider style={{marginTop: 5}} />

                  <Box>
                    <Grid item xs={12} md={12} xl={12}>
                      <AssetChart data={dataChart} />
                    </Grid>
                  </Box>
                </AppCard>              
              )
            }
          </Grid>
          {
            <Grid item xs={12} md={12} style={{ marginTop: 15 }}>
              <DefiCoins {...defiBalance} />
            </Grid>
          }
        </Grid>
        
      </GridContainer>
    </Box>
  );
};

export default Wallet;
