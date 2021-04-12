import React, { useCallback, useEffect, useState } from 'react';
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
import { Link, RouteComponentProps } from 'react-router-dom';
import { BitqueryAddress } from 'types/bitquery/address.interface';
import { MyBalance } from 'types/bitquery/myBalance.interface';
import { BalanceCoins, TotalBalanceData } from 'types/models/Crypto';
import { CurrencyPair } from '@types';
// import { ZERO_ADDRESS } from 'shared/constants/Blockchain';
import { getToken } from 'services/rest/coingecko';
import { CoinDetailCoinGecko } from 'types/coingecko';
import { Fonts } from 'shared/constants/AppEnums';
import StepModal from 'shared/components/StepModal';
import StepModalContent from 'shared/components/StepModal/stepModalContent';
import { useWeb3 } from 'hooks/useWeb3';

const TVChartContainer = React.lazy(() => import('../../../shared/components/chart/TvChart/tv_chart'));

export const marketToString = (currencyPair: CurrencyPair): string => {
  return `${currencyPair.base.toUpperCase()}-${currencyPair.quote.toUpperCase()}`;
};


type TokenParams = {
  address?: string;
};

type TokenProps = RouteComponentProps<TokenParams>


// function parseTotalBalance(address?: BitqueryAddress[]): TotalBalanceData {
//   const _balances = address != null ? address
//     .reduce(
//       (arr: MyBalance[], e) => {
//         arr.push(...e.balances as MyBalance[]);
//         return arr;
//       }, []
//     ) : [];

//   const totalBalanceData: TotalBalanceData = {
//     balance: _balances.reduce(
//       (totalBalance: BigNumber, b) => totalBalance.plus(b.value ?? 0), new BigNumber(0)
//     ).toString(),
//     coins: _balances.map((x, i) => {
//       const { currency } = x;
//       return {
//         id: i,
//         name: currency.name,
//         value: x.value,
//         symbol: currency.symbol
//       } as BalanceCoins;
//     })
//   };
//   return totalBalanceData;
// }


const Crypto: React.FC<TokenProps> = (props) => {
  const {match: { params }} = props;
  const { address } = params;

  const { account } = useWeb3();

  const [balances, setBalances] = useState<MyBalance[]>([]);
  const [info, setInfo] = useState<CoinDetailCoinGecko>();
  const [modalIsOpen, setOpenModal] = useState<boolean>(false);


  const handleModal = useCallback((event: React.SyntheticEvent<HTMLElement, Event>) => {
    console.log('modal event', event);
    setOpenModal(false);
  }, []);

  useEffect(useCallback(() => {
    if (address) {

      getToken(address).then( data => {
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
      })
    }
  }, []), []);


  return (
    <>
      { balances ? (
        <>
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
                <TotalBalance balances={balances} />
              </Grid>
                
              <Grid style={{ marginTop: 15 }} item xs={12} md={12} key="item-grid-buy-sell">
                <BuySell 
                  actionButton={($e) => {
                    setOpenModal(!modalIsOpen)
                  }}
                />
              </Grid>

              <GridContainer style={{marginTop: 2}}  >
                <Grid item xs={12} sm={6} md={6}>
                  <Link to={`/history/order/token/${address}`} style={{textDecoration: 'none'}}>
                    <InfoCard state={{
                      value: "Order history",
                      bgColor: "#0A8FDC",
                      icon: "/assets/images/dashboard/1_monthly_sales.png",
                      id: 1,
                      type: "Click to Open",
                    }} />
                  </Link>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Link to={`/history/transaction/token/${address}`} style={{textDecoration: 'none'}}>
                    <InfoCard state={{
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

            <Grid item xs={12} md={7}>
              <GridContainer>
                <Grid style={{padding: 5, height: '400px'}} item xs={12} sm={12} md={12}>
                  <TVChartContainer symbol={`${info?.symbol.toUpperCase()}-WETH`} chainId={1} />
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

            <GridContainer key="grid-child-2">
              <Grid style={{ padding: 5 }} item xs={12} sm={6} md={6} key="grid-item-cards">
                {/* <ProfileCard /> */}
              </Grid>
              <Grid style={{ padding: 5 }} item xs={12} sm={6} md={6} key="grid-item-sale-state">
                {/* <SalesState salesState={MOCKET_THING} /> */}
              </Grid>
            </GridContainer>
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
      ): null}
    </>
  )
}


export default Crypto;
