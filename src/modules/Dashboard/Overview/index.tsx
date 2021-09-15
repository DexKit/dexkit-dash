import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';

import Grid from '@material-ui/core/Grid';
import GridContainer from '../../../@crema/core/GridContainer';
import Box from '@material-ui/core/Box';

import ProtocolNavigationUniswap from './ProtocolNavigation/uniswap';
import ProtocolNavigationZRXProtocol from './ProtocolNavigation/zrxprotocol';
import ProtocolNavigationSushiSwap from './ProtocolNavigation/sushiswap';
import ProtocolNavigationBalancer from './ProtocolNavigation/balancer';
import News from 'shared/components/News/';
import InfoToken from './InfoToken';
import {ReportCards} from 'types/models/Ecommerce';
import {getOverviewCoinsData} from 'services/rest/coingecko';
import {Button} from '@material-ui/core';
import {onAddNotification} from 'redux/actions';
import {Notification} from 'types/models/Notification';

interface Props {}

const Overview: React.FC<Props> = () => {
  const [ethData, setEthData] = useState<ReportCards>();
  const [kitData, setKitData] = useState<ReportCards>();
  const [btcData, setBtcData] = useState<ReportCards>();
  const dispatch = useDispatch();

  useEffect(
    useCallback(() => {
      getOverviewCoinsData().then((e) => {
        const coins = e.map((d) => {
          const obj: ReportCards = {
            id: Math.random(),
            icon: d?.image ?? '/assets/images/dashboard/icon_revenue.png',
            type: d?.name,
            strokeColor: '#ffcb49',
            value: `$${d?.current_price?.toFixed(2) ?? 0.0}`,
            growth: d?.price_change_percentage_24h,
            graphData:
              d?.sparkline_in_7d?.price?.map((p, i) => {
                return {month: i.toString(), number: p};
              }) ?? [],
          };
          return obj;
        });

        setKitData(coins[0]);
        setBtcData(coins[1]);
        setEthData(coins[2]);
      });
    }, []),
    [],
  );

  return (
    <Box pt={{xl: 4}}>
      <GridContainer>
        <Grid item xs={12} md={4}>
          <InfoToken data={ethData} timeout={0} />
        </Grid>
        <Grid item xs={12} md={4}>
          <InfoToken data={kitData} timeout={500} />
        </Grid>
        <Grid item xs={12} md={4}>
          <InfoToken data={btcData} timeout={1000} />
        </Grid>

        <Grid item xs={12} lg={8}>
          <GridContainer>
            <Grid item xs={12} md={6}>
              <ProtocolNavigationUniswap />
            </Grid>
            <Grid item xs={12} md={6}>
              <ProtocolNavigationSushiSwap />
            </Grid>
            <Grid item xs={12} md={6}>
              <ProtocolNavigationZRXProtocol />
            </Grid>
            <Grid item xs={12} md={6}>
              <ProtocolNavigationBalancer />
            </Grid>
          </GridContainer>
        </Grid>
        <Grid item xs={12} lg={4}>
          <News />
        </Grid>
        {/*TODO: remover isso aqui após os testes de notificação */}
        {/* <Grid>
          <Button 
          onClick={
            () => {
              const notification: Notification = { 
                title: 'Config Accepted', 
                 body: 'Config created' 
              };
              dispatch(onAddNotification([notification]));
            }
          }
          >
            Enviar notificação
          </Button>
        </Grid> */}
      </GridContainer>
    </Box>
  );
};

export default Overview;
