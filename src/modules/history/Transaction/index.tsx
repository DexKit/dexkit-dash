import React, {useCallback, useEffect, useState } from 'react';
// import { useHistory, useLocation } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import TotalBalance from 'shared/components/TotalBalance';
import GridContainer from '../../../@crema/core/GridContainer';
import InfoView from '../../../@crema/core/InfoView';
import Box from '@material-ui/core/Box';
import SalesState from './SalesState'
import BuySell from './BuySell'
import InfoCard from './InfoCard'
import ProfileCard from './ProfileCard'

import { BigNumber } from '@0x/utils';
import { INFOR_CARD } from './MockedData'
import { RouteComponentProps } from 'react-router-dom';
import { BitqueryAddress } from 'types/bitquery/address.interface';
import { MyBalance } from 'types/bitquery/myBalance.interface';
import { BalanceCoins, TotalBalanceData } from 'types/models/Crypto';
import { CurrencyPair } from '@types';
// import { ZERO_ADDRESS } from 'shared/constants/Blockchain';
import { getToken } from 'services/rest/coingecko';
import { CoinDetailCoinGecko } from 'types/coingecko';
import { Fonts } from 'shared/constants/AppEnums';

const TVChartContainer = React.lazy(() => import('../../../shared/components/chart/TvChart/tv_chart'));

export const marketToString = (currencyPair: CurrencyPair): string => {
  return `${currencyPair.base.toUpperCase()}-${currencyPair.quote.toUpperCase()}`;
};


type CryptoParams = {
  token_address?: string;
};

type CryptoProps = RouteComponentProps<CryptoParams>


function parseTotalBalance(address?: BitqueryAddress[]): TotalBalanceData {
  const _balances = address != null ? address
    .reduce(
      (arr: MyBalance[], e) => {
        arr.push(...e.balances as MyBalance[]);
        return arr;
      }, []
    ) : [];
    
  const totalBalanceData: TotalBalanceData = {
    balance: _balances.reduce(
      (totalBalance: BigNumber, b) => totalBalance.plus(b.value ?? 0), new BigNumber(0)
    ).toString(),
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


const Crypto: React.FC<CryptoProps> = (props) => {
  
  const {match: { params }} = props;
 
  const tokenAddress = params.token_address;

  const [ totalBalanceData, setTotalBalanceData] = useState<TotalBalanceData>({
    balance: '0',
    coins: []
  });

  const [balances, setBalances] = useState<MyBalance[]>([]);
  const [info, setInfo] = useState<CoinDetailCoinGecko>();


  useEffect(useCallback(() => {
    if(tokenAddress != null){
      getToken(tokenAddress).then( data => {
        if (data) {
          setInfo(data);
        }

        const _myBalances: MyBalance[] = [{
          value: data.market_data.current_price.eth,
          currency: {
            address: data.contract_address,
            name: data.name,
            tokenType: '',
            symbol: data.symbol,
            decimals: 18
          }
        }];
        setBalances(_myBalances);
        const bitQuery: BitqueryAddress[] = [{
          balances: _myBalances as MyBalance[]
        }]
        setTotalBalanceData(parseTotalBalance(bitQuery));
      })
    }
  }, []), []);



  return (
    <>
      { balances ? (
        <Box pt={{xl: 4}}>
          
          <GridContainer>
            <Grid item xs={12} md={12}>
              <Box
                component='h2'
                color='text.primary'
                fontSize={{xs: 18, sm: 20, xl: 22}}
                mb={{xs: 4, sm: 4, xl: 6}}
                fontFamily={Fonts.LIGHT}>
                {info?.name} Token
              </Box>
            </Grid>
          </GridContainer>
          
          <GridContainer>
            <Grid item xs={12} md={5}>
              <Grid item xs={12} md={12}>
                {/* <TotalBalance balances={balances} /> */}
              </Grid>
                
              <Grid style={{marginTop: 15}} item xs={12} md={12}>
                <BuySell buySell={
                  {
                    buyData: {
                      value: '',
                      price: '',
                      amount: '' 
                    },
                    sellData: {
                      value: '',
                      price: '',
                      amount: '' 
                    }
                  }
                } />
              </Grid>

              <GridContainer style={{marginTop: 2}}  >
                  {INFOR_CARD.map((state, index) => (
                    <Grid item xs={12} sm={6} md={6} key={index}>
                      <InfoCard state={state} />
                    </Grid>
                  ))} 
              </GridContainer>

            </Grid>

            <Grid item xs={12} md={7}>
              <GridContainer>
                <Grid style={{padding: 5, height: '400px'}} item xs={12} sm={12} md={12}>
                  <TVChartContainer symbol={"WETH-KIT"} chainId={1} />
                </Grid>
              </GridContainer>
             
              <GridContainer style={{marginTop: 15}}>
                <Grid style={{padding: 5}} item xs={12} sm={6} md={6} >
                  <ProfileCard data={info} />
                </Grid>
                <Grid style={{padding: 5}} item xs={12} sm={6} md={6} >
                  <SalesState data={info} />
                </Grid>  
              </GridContainer>
            </Grid>
          </GridContainer>
        </Box>
      ) : null}

      <InfoView />
    </>
  );
};

export default Crypto;
