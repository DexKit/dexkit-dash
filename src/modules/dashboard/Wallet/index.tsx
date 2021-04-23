import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWeb3 } from 'hooks/useWeb3';
import { AppState } from 'redux/store';
import { onGetMyTokenBalances, onGetMyDefiBalances } from 'redux/actions';

import { Grid, Box, Divider } from '@material-ui/core';

import transakSDK from '@transak/transak-sdk';

import { MessageView } from '@crema';
import AppSelect from '@crema/core/AppSelect';
import GridContainer from '@crema/core/GridContainer';
import AppCard from '@crema/core/AppCard';

import { useIntl } from 'react-intl';

import DefiCoins, { CoinsProps } from './DefiCoins';
import AssetChart from './AssetChart';
import AssetTable from './AssetTable';
import SalesState from './SalesState'

import TotalBalance from 'shared/components/TotalBalance';
import { Fonts } from 'shared/constants/AppEnums';
import { getTransak } from 'services/transak/transakClient';

import { BalanceCoins, TotalBalanceData } from 'types/models/Crypto';
import { BitqueryAddress } from 'types/bitquery/address.interface';
import { MyBalance } from 'types/bitquery/myBalance.interface';
import { Link } from 'react-router-dom';
import { GET_NETWORK_NAME } from 'shared/constants/Bitquery';
import {parseDefiAssets} from '../../../utils/parse'
import Transak from 'shared/components/Transak';

interface Props { }

const Wallet: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  
  const { account, chainId } = useWeb3();
  const { messages } = useIntl();

  const [chartData, setChartData] = useState([] as any);
  const [defiAssets, setDefiAssets] = useState({} as CoinsProps);
  const [transakClient, setTransakInstance] = useState<transakSDK>();

  const { myDefiBalances, myBalances } = useSelector<AppState, AppState['dashboard']>(
    ({ dashboard }) => dashboard,
  );
  
  const updateChart = (name: string) => {
    const findToken = myBalances.filter(e => e.currency.name == name);

    if (findToken.length > 0) {
      const cData = findToken[0].history?.map(e => {
        return {
          name: new Date(e.timestamp),
          value: e.value
        }
      })
      setChartData(cData);
    } else {
      setChartData([]);
    }
  }

  useEffect(() => {
    if (account != null) {
      dispatch(onGetMyDefiBalances(account));
      dispatch(onGetMyTokenBalances(GET_NETWORK_NAME(chainId), account));
    }
  }, [dispatch, account]);

  useEffect(() => {
    setDefiAssets(parseDefiAssets(myDefiBalances));
  }, [myDefiBalances]);

  useEffect(() => {
    updateChart('Ether');
  }, [myBalances]);

  const transakAllEvents = useCallback((data: any) => {
    console.log(data);
  }, []);
  
  const transakCloseEvents = useCallback((data: any) => {
    console.log(data);
    transakClient?.close();
    setTransakInstance(undefined);
  }, [transakClient]);

  const transakSucessEvents = useCallback((data: any) => {
    console.log(data);
    transakClient?.close();
    setTransakInstance(undefined);
  }, [transakClient]);


  useEffect(useCallback(
    () => {
      if(transakClient != null) {
        console.log('inicializando eventos do transakSDK');
        // transakClient.on(transakClientALL_EVENTS, transakAllEvents);
        // transakClient.on(transakClient.TRANSAK_WIDGET_CLOSE, transakCloseEvents);
        // transakClient.on(transakClient.TRANSAK_ORDER_SUCCESSFUL, transakSucessEvents);
      }
    },
    [
      transakClient,
      transakAllEvents,
      transakCloseEvents,
      transakSucessEvents
    ]
  ), [
    transakClient,
    transakAllEvents,
    transakCloseEvents,
    transakSucessEvents
  ]);

  if (account == null || account.length === 0) return <MessageView variant='error' message="Falha ao carrega informações da sua carteira" />;

  return (
    <>
      <Box pt={{ xl: 4 }}>

        <GridContainer>
          <Grid item xs={12} md={12}>
            <Box
              component='h2'
              color='text.primary'
              fontSize={{xs: 18, sm: 20, xl: 22}}
              mb={{xs: 4, sm: 4, xl: 6}}
              fontFamily={Fonts.LIGHT}>
                MY TOTAL BALANCE
            </Box>
          </Grid>
        </GridContainer>

        <GridContainer>

          <Grid item xs={12} md={6}>
            <Grid item xs={12} md={12}>
              <TotalBalance balances={myBalances}/>
            </Grid>

            <Grid item xs={12} md={12} style={{ marginTop: 15 }}>
              <AssetTable balances={(myBalances)} />
            </Grid>

            <GridContainer style={{marginTop: 2}}>
              <Grid item xs={12} sm={6} md={6}>
                <Link to={`/history/order/account/${account}`} style={{textDecoration: 'none'}}>
                  <SalesState state={{
                    value: "Order history",
                    bgColor: "#0A8FDC",
                    icon: "/assets/images/dashboard/1_monthly_sales.png",
                    id: 1,
                    type: "Click to Open",
                  }} />
                </Link>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <Link to={`/history/transaction/account/${account}`} style={{textDecoration: 'none'}}>
                  <SalesState state={{
                    value: "Transaction history",
                    bgColor: "#9E49E6",
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
              <AppCard style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 5 }}>
                <Box paddingLeft="0" display="flex">
                  <AppSelect
                    menus={myBalances.map(e => e.currency.name)}
                    defaultValue={'Ether'}
                    onChange={(e) => {updateChart(e)}}
                  />

                  {/* <Transak /> */}
                </Box>

                <Divider style={{marginTop: 5}} />

                <Box>
                  <Grid item xs={12} md={12} xl={12}>
                    <AssetChart data={chartData} />
                  </Grid>
                </Box>
              </AppCard>
            </Grid>
            {
              myDefiBalances.length > 0 && 
              <Grid item xs={12} md={12} style={{ marginTop: 15 }}>
                <DefiCoins {...defiAssets} />
              </Grid>
            }
          </Grid>
          
        </GridContainer>
      </Box>
    </>
  );
};

export default Wallet;
