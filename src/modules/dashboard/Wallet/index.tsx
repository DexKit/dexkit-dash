import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import { onGetMyTokenBalances, onGetMyTokenBalancesAt, onGetMyDefiBalances } from 'redux/actions';
import { useWeb3 } from 'hooks/useWeb3';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { Button, Divider } from '@material-ui/core';

import TotalBalance from 'shared/components/TotalBalance';

import { MessageView } from '@crema';
import GridContainer from '@crema/core/GridContainer';
import InfoView from '@crema/core/InfoView';
import AppCard from '@crema/core/AppCard';

import { useIntl } from 'react-intl';

import Coins, { CoinsProps, Assets, CoinProps } from './Coins';
import RecentPatients from './RecentPatients';
import SalesState from './SalesState'
import { ProtocolBalanceInterface, AssetBalanceInterface } from 'defi-sdk/src/protocols/interfaces';

import { BitqueryAddress } from 'types/bitquery/address.interface';
import { MyBalance } from 'types/bitquery/myBalance.interface';
import { BalanceCoins, CoinData, TotalBalanceData } from 'types/models/Crypto';

import transakSDK from '@transak/transak-sdk';
import { getTransak } from 'services/transak/transakClient';
import AssetChart from './AssetChart';
import { Fonts } from 'shared/constants/AppEnums';
import AppSelect from '@crema/core/AppSelect';
import { MOCKET_THING } from './MockedData';


interface WalletProps { }

function parseTotalBalance(address?: BitqueryAddress[]): TotalBalanceData {
  const _balances = address != null ? address.reduce((arr: MyBalance[], e) => {
        arr.push(...e.balances as MyBalance[]);
        return arr;
      }, []
  ) : [];
  
  const totalBalanceData: TotalBalanceData = {
    balance: _balances.filter(e => e.currency.symbol == 'ETH')[0]?.value.toString() || '0',
    // balance: _balances.reduce((totalBalance: BigNumber, b) => totalBalance.plus(b.value ?? 0), new BigNumber(0)).toString(),
    coins: _balances.map((x, i) => {
      const { currency } = x;
      return {
        id: i,
        name: currency.name,
        value: x.value,
        symbol: currency.symbol
      } as BalanceCoins;
    })
  };
  return totalBalanceData;
}

function balance2CoinsData(balances: AssetBalanceInterface[]): CoinProps[] {
  return balances.map(balance => {
    const coinData: CoinData = {
      increment: Math.random(),
      name: balance.base.metadata.name,
      symbol: balance.base.metadata.symbol,
      price: balance.base.getAmount().toString()
    };
    return {
      token: balance.base.metadata.address,
      coinsDataProps: coinData
    } as CoinProps;
  });
}

function assets2CoinsProps(accountBalances: ProtocolBalanceInterface[]): CoinsProps {
  const assets: Assets[] = [];
  accountBalances.forEach(protocols => {
    assets.push(
      ...protocols.balances.map(_assets => {
        return {
          address: _assets.metadata.address,
          coinsData: balance2CoinsData(_assets.balances)
        } as Assets;
      })
    );
  });
  return {
    assets
  } as CoinsProps
}

const onBuy = (walletAddress: string, ): transakSDK => {
    const transak = getTransak(
      walletAddress,
      '#0A8FDC',
      '',
      'GBP',
      undefined,
      '450px',
      '400px'
    );
    transak.init();
    return transak;
}

const Wallet: React.FC<WalletProps> = () => {
  const dispatch = useDispatch();
  
  const { account } = useWeb3();
  const { messages } = useIntl();
  const [chartData, setChartData] = useState([] as any);
  const [defiAssets, setDefiAssets] = useState({} as CoinsProps);
  const [transakClient, setTransakInstance] = useState<transakSDK>();

  const { accountBalancesData, myBalances, myBalancesAt } = useSelector<AppState, AppState['dashboard']>(
    ({ dashboard }) => dashboard,
  );
  

  useEffect(() => {
    if (account != null) {
      dispatch(onGetMyDefiBalances('0x551eefc88397c7372261190ca3ffdd4892056d7d' /*account*/));
      dispatch(onGetMyTokenBalances('ethereum', '0x551eefc88397c7372261190ca3ffdd4892056d7d' /*account*/));
      dispatch(onGetMyTokenBalancesAt('ethereum', '0x551eefc88397c7372261190ca3ffdd4892056d7d' /*account*/, 7));
    }
  }, [dispatch, account]);


  useEffect(() => {
    const data = myBalancesAt.map((e: any) => {
      return {
        name: e.date.getDate().toString(),
        eth: e.balances['ETH'].value
      }
    });

    setChartData(data);
  }, [myBalancesAt])

  useEffect(() => {
    setDefiAssets(assets2CoinsProps(accountBalancesData));
  }, [accountBalancesData]);

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
      if(transakClient != null){
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  // const data = useQuery<{ ethereum: { address: BitqueryAddress[] } }>(
  //   MY_ASSETS_AND_MY_BALANCE, 
  //   {
  //     client: bitQueryClient,
  //     variables: {
  //       network: "ethereum",//
  //       address: '0x4319e7a95fd3f0660d25bc6a4ecdc0f3cb4200c5'
  //     }
  //   }
  // );

  return (
    <>
      { accountBalancesData && myBalances ? (
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
              <TotalBalance totalBalanceData={parseTotalBalance(myBalances)} balances={(myBalances[0]?.balances as MyBalance[])}/>
            </Grid>

            <Grid item xs={12} md={6} style={{ paddingLeft: 0, paddingRight: 0, }}>
              <AppCard style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 5 }}>
                <Box paddingLeft="0" display="flex">
                <AppSelect
                    menus={[
                      messages['dashboard.wallet.mybalance'],
                    ]}
                    defaultValue={messages['dashboard.wallet.mybalance']}
                    onChange={(e) => console.log('changed')}
                  />

                  <Button
                    color="primary"
                    variant="contained"
                    onClick={(e: any) => { 
                      if (e) {
                        setTransakInstance(onBuy(account));
                      }
                    }}
                    size="small"
                    style={{ marginRight: 5, marginLeft: 'auto' }}
                    disableElevation>
                    Buy
                  </Button>
                </Box>
                <Divider style={{marginTop: 5}} />
                <Box>

                  <Grid item xs={12} md={12} xl={12}>
                    <AssetChart data={chartData} />
                  </Grid>

                </Box>
              </AppCard>
            </Grid>

            <Grid item xs={12} sm={12} md={6}>
              { myBalances.length > 0 && <RecentPatients recentPatients={(myBalances[0]?.balances as MyBalance[])} /> }
            </Grid>

            <Grid item xs={12} md={6}>
              <Coins {...defiAssets} />
            </Grid>

            {MOCKET_THING.map((state, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <SalesState state={state} />
              </Grid>
            ))}

          </GridContainer>
        </Box>
      ) : null}

      <InfoView />
    </>
  );
};

export default Wallet;
