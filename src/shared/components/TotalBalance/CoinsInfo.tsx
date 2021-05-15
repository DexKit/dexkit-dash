import React from 'react';
import Box from '@material-ui/core/Box';
import {indigo} from '@material-ui/core/colors';
import {Fonts} from 'shared/constants/AppEnums';
import {MyBalance} from 'types/bitquery/myBalance.interface';

interface CoinsInfoProps {
  coins: MyBalance[];
  coinFeatured?: {symbol: string, address: string};
}

const CoinsInfo: React.FC<CoinsInfoProps> = ({coins, coinFeatured}) => {
  const totalDisplayCoins = coinFeatured ? 3 : 4

  const coinsFn = coins
    .filter(c => c.value > 0)
    .filter(c=> c.currency.address.toLowerCase() !== coinFeatured?.address.toLowerCase())
    .sort((a, b) => (b?.valueUsd ?? 0) - (a?.valueUsd ?? 0))
    .slice(0, coins.length > totalDisplayCoins ? totalDisplayCoins : coins.length);
  let coin;

  if(coinFeatured){
   const findedCoin  = coins.find(c => c.currency.address.toLowerCase() === coinFeatured.address.toLowerCase());
   if(findedCoin){
    coin = findedCoin
   }else{
     coin = {
       currency:{
         symbol: coinFeatured.symbol
      },
      valueUsd: 0,
      value: 0,
      symbol: coinFeatured.symbol,
     }
   }
  }


  
  return (
    <Box
      mx={-2}
      mb={{xl: 1}}
      display='flex'
      flexWrap='wrap'
      justifyContent='space-between'>
      {coin && 
                <Box
                  flexGrow={1}
                  flexBasis={{xs: '50%', sm: '25%', md: '50%', lg: 'auto'}}
                  border={1}
                  borderColor="primary.main"
                  mt={3}
                  px={2}
                >
                {/* <Box mt={{xl: 3}} px={2} key={coin.currency.address}> */}
                <Box
                  mb={{xs: 0, sm: 0, xl: 3}}
                  color='text.primary'
                  fontFamily={Fonts.LIGHT}
                  component='h3'
                  fontSize={{xs: 18, sm: 20, xl: 22}}>
                  ${coin?.valueUsd?.toFixed(2) || 0}
                </Box>
                <Box component='p' fontSize={{xs: 16, xl: 18}} color={indigo[200]}>
                  {coin.value.toFixed(4) ?? '?'} {coin.currency.symbol.toUpperCase() ?? '?'}
                </Box>
              </Box>
      }


      {coinsFn
        .map((coin, index) => {
            return (
              <Box
                flexGrow={1}
                flexBasis={{xs: '50%', sm: '25%', md: '50%', lg: 'auto'}}
                mt={3}
                px={2}
                key={index}>
                {/* <Box mt={{xl: 3}} px={2} key={coin.currency.address}> */}
                <Box
                  mb={{xs: 0, sm: 0, xl: 3}}
                  color='text.primary'
                  fontFamily={Fonts.LIGHT}
                  component='h3'
                  fontSize={{xs: 18, sm: 20, xl: 22}}>
                  ${coin?.valueUsd?.toFixed(2) || 0}
                </Box>
                <Box component='p' fontSize={{xs: 16, xl: 18}} color={indigo[200]}>
                  {coin.value.toFixed(4) ?? '?'} {coin.currency.symbol ?? '?'}
                </Box>
              </Box>
            );
          })}
        </Box>
  );
};

export default CoinsInfo;
