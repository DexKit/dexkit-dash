import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import { onGetMyTokenBalances, onGetMyDefiBalances } from 'redux/actions';

import { Grid, Box, Divider } from '@material-ui/core';

import transakSDK from '@transak/transak-sdk';

import { MessageView, InfoView } from '@crema';
import AppSelect from '@crema/core/AppSelect';
import GridContainer from '@crema/core/GridContainer';
import AppCard from '@crema/core/AppCard';

import { useIntl } from 'react-intl';

import DefiCoins, { CoinsProps } from './DefiCoins';
import AssetChart from './AssetChart';
import AssetTable from './AssetTable';
import HistoryState from './HistoryState'

import TotalBalance from 'shared/components/TotalBalance';

import { Link } from 'react-router-dom';

import {parseDefiAssets} from '../../../utils/parse'
import { useWeb3 } from 'hooks/useWeb3';
import { GET_NETWORK_NAME } from 'shared/constants/Bitquery';
import PageTitle from './PageTitle';


interface Props { }

const Wallet: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  
  const { account, chainId } = useWeb3();
  const { messages } = useIntl();

  const [chartName, setChartName] = useState<string>('Ether');
  const [chartDays, setChartDays] = useState<number>(30);

  const [chartData, setChartData] = useState([] as any);
  const [defiAssets, setDefiAssets] = useState({} as CoinsProps);
  const [transakClient, setTransakInstance] = useState<transakSDK>();

  const { myDefiBalances, myBalances } = useSelector<AppState, AppState['dashboard']>(
    ({ dashboard }) => dashboard,
  );
  
  const updateChart = () => {
    const findToken = myBalances.filter(e => e.currency.name === chartName);

    if (findToken.length > 0) {
      const hist = findToken[0].history as {[key: string]: {today: number, yesterday: number}};

      if (hist) {
        const today = new Date();
        const cData: any[] = [];

        let lastValue: any = 0;;
        
        for (let i = 0; i < chartDays; i++) {
          const key = today.toDateString();

          if (hist[key]) {
            lastValue = hist[key].yesterday;
            cData.push({ name: key, value: hist[key].today })
          } else {
            cData.push({ name: key, value: lastValue})
          }
          
          today.setDate(today.getDate() - 1);
        }

        setChartData(cData.reverse());
      } else {
        setChartData([]);
      }
    } else {
      setChartData([]);
    }
  }

  useEffect(() => {
    if (account && chainId) {
      dispatch(onGetMyDefiBalances(account));
      dispatch(onGetMyTokenBalances(GET_NETWORK_NAME(chainId), account));
    }
  }, [dispatch, account, chainId]);

  useEffect(() => {
    setDefiAssets(parseDefiAssets(myDefiBalances));
  }, [myDefiBalances]);

  useEffect(() => {
    if (chartName && chartDays) {
      updateChart();
    }
  }, [myBalances, chartName, chartDays]);

  const transakAllEvents = useCallback((data: any) => {
    console.log(data);
  }, []);
  
  const transakCloseEvents = useCallback((data: any) => {
    transakClient?.close();
    setTransakInstance(undefined);
  }, [transakClient]);

  const transakSucessEvents = useCallback((data: any) => {
 
    transakClient?.close();
    setTransakInstance(undefined);
  }, [transakClient]);


  useEffect(useCallback(
    () => {
      if(transakClient != null) {
        // console.log('inicializando eventos do transakSDK');
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

        <PageTitle
          history={[
            {url:'/', name: 'Dashboard'}
          ]}
          active={'Wallet'}
          title={'Wallet'}
        />

        <GridContainer>

          <Grid item xs={12} md={6}>
            <Grid item xs={12} md={12}>
              <TotalBalance balances={myBalances}/>
            </Grid>

            <Grid item xs={12} md={12} style={{ marginTop: 15 }}>
              <AssetTable balances={(myBalances.filter(b=> b.value > 0))} />
            </Grid>

            <GridContainer style={{marginTop: 2}}>
              <Grid item xs={12} sm={6} md={6}>
                <Link to={`/history/order/account/${account}`} style={{textDecoration: 'none'}}>
                  <HistoryState state={{
                    value: "Order history",
                    bgColor: "#ff7149",
                    icon: "/assets/images/dashboard/1_monthly_sales.png",
                    id: 1,
                    type: "Click to Open",
                  }} />
                </Link>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <Link to={`/history/transaction/account/${account}`} style={{textDecoration: 'none'}}>
                  <HistoryState state={{
                    value: "Transaction history",
                    bgColor: "#c52b00",
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
                <Box paddingLeft="5px" paddingRight="5px" display="flex" justifyContent={'space-between'}>
                  <AppSelect
                    menus={myBalances.map(e => e.currency.name)}
                    defaultValue={'Ether'}
                    onChange={(e) => setChartName(e)}/>

                  <AppSelect
                    menus={['7 days', '15 days', '30 days']}
                    defaultValue={'30 days'}
                    onChange={(e) => { setChartDays(Number(e.split(' ')[0])) }}
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
              <Grid item xs={12} md={12} style={{ marginTop: 15 }}>
                <DefiCoins {...defiAssets} />
              </Grid>
            }
          </Grid>
          
        </GridContainer>
      </Box>
      <InfoView />
    </>
  );
};

export default Wallet;
