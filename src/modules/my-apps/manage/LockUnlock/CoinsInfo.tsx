import React from 'react';
import Box from '@material-ui/core/Box';
import {indigo} from '@material-ui/core/colors';
import {Fonts} from 'shared/constants/AppEnums';
import {MyBalance} from 'types/bitquery/myBalance.interface';

interface CoinsInfoProps {
  coins: MyBalance[];
}

const CoinsInfo: React.FC<CoinsInfoProps> = ({coins}) => {
  const coinsFn = coins
    .sort((a, b) => (b?.valueUsd ?? 0) - (a?.valueUsd ?? 0))
    .slice(0, coins.length > 4 ? 4 : coins.length);

  return (
    <Box
      mx={-2}
      mb={{xl: 1}}
      display='flex'
      flexWrap='wrap'
      justifyContent='space-between'>
      {coinsFn.map((coin, index) => {
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
              color='primary.contrastText'
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
