import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWeb3 } from 'hooks/useWeb3';
import { AppState } from 'redux/store';
import { onGetMyTokenBalances, onGetMyTokenBalancesAt, onGetMyDefiBalances } from 'redux/actions';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { Button, Divider } from '@material-ui/core';

import transakSDK from '@transak/transak-sdk';

import { MessageView } from '@crema';
import AppSelect from '@crema/core/AppSelect';
import GridContainer from '@crema/core/GridContainer';
import AppCard from '@crema/core/AppCard';

import { useIntl } from 'react-intl';

import Coins, { CoinsProps, Assets, CoinProps } from './Coins';
import AssetChart from './AssetChart';
import AssetTable from './AssetTable';
import SalesState from './SalesState'
import { ProtocolBalanceInterface, AssetBalanceInterface } from 'defi-sdk/src/protocols/interfaces';

import TotalBalance from 'shared/components/TotalBalance';
import { Fonts } from 'shared/constants/AppEnums';
import { getTransak } from 'services/transak/transakClient';

import { BalanceCoins, CoinData, TotalBalanceData } from 'types/models/Crypto';
import { BitqueryAddress } from 'types/bitquery/address.interface';
import { MyBalance } from 'types/bitquery/myBalance.interface';
import { Link } from 'react-router-dom';
import { GET_NETWORK_NAME } from 'shared/constants/Bitquery';



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
  
  const { account, chainId } = useWeb3();
  const { messages } = useIntl();

  // const [assets, setAssets] = useState([] as any);

  const [chartData, setChartData] = useState([] as any);
  const [defiAssets, setDefiAssets] = useState({} as CoinsProps);
  const [transakClient, setTransakInstance] = useState<transakSDK>();

  const { myDefiBalances, myBalances, myBalancesAt } = useSelector<AppState, AppState['dashboard']>(
    ({ dashboard }) => dashboard,
  );
  

  useEffect(() => {
    if (account != null) {
      dispatch(onGetMyDefiBalances(account));
      dispatch(onGetMyTokenBalances(GET_NETWORK_NAME(chainId), account));
      dispatch(onGetMyTokenBalancesAt(GET_NETWORK_NAME(chainId), account, 7));
    }
  }, [dispatch, account]);

  useEffect(() => {
    setDefiAssets(assets2CoinsProps(myDefiBalances));
  }, [myDefiBalances]);

  useEffect(() => {
    const data: any = myBalancesAt.map((e: any) => {
      return {
        name: e.date.getDate().toString(),
        eth: e?.balances['ETH']?.value || 0
      }
    });

    setChartData(data);
  }, [myBalancesAt])


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
      { myDefiBalances && myBalances ? (
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

              <Grid item xs={12} md={12}>
                <Coins {...defiAssets} />
              </Grid>
            </Grid>
            
          </GridContainer>
        </Box>
      ) : null}
    </>
  );
};

export default Wallet;
