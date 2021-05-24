import React from 'react';
import Box from '@material-ui/core/Box';
import {indigo} from '@material-ui/core/colors';
import {Fonts} from 'shared/constants/AppEnums';
import { GetMyBalance_ethereum_address_balances } from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';

interface CoinsInfoProps {
  coins: GetMyBalance_ethereum_address_balances[];
}

const CoinsInfo: React.FC<CoinsInfoProps> = ({coins}) => {
  const coinsFn = coins
    .sort((a, b) => (b?.valueInUsd ?? 0) - (a?.valueInUsd ?? 0))
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
          <Box flexGrow={1} flexBasis={{xs: '50%', sm: '25%', md: '50%', lg: 'auto'}} mt={3} px={2} key={index}>
            {/* <Box mt={{xl: 3}} px={2} key={coin.currency.address}> */}
            <Box
              mb={{xs: 0, sm: 0, xl: 3}}
              color='text.primary'
              fontFamily={Fonts.LIGHT}
              component='h3'
              fontSize={{xs: 18, sm: 20, xl: 22}}>
              ${coin?.valueInUsd?.toFixed(2) || 0}
            </Box>
            <Box component='p' fontSize={{xs: 16, xl: 18}} color={indigo[200]}>
              {coin?.value?.toFixed(4) ?? '?'} {coin?.currency?.symbol ?? '?'}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default CoinsInfo;
