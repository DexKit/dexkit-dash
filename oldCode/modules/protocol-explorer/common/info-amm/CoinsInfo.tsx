import React from 'react';
import Box from '@material-ui/core/Box';
import {indigo} from '@material-ui/core/colors';
import {BalanceCoins} from 'types/models/Crypto';
import {Fonts} from 'shared/constants/AppEnums';

interface CoinsInfoProps {
  coins: BalanceCoins[];
}

const CoinsInfo: React.FC<CoinsInfoProps> = ({coins}) => {
  return (
    <Box
      mx={-2}
      mb={{xl: 1}}
      display='flex'
      flexWrap='wrap'
      justifyContent='space-between'>
      {coins.map((coin) => {
        return (
          <Box
            flexGrow={1}
            flexBasis={{xs: '50%', sm: '25%', md: '50%', lg: 'auto'}}
            mt={3}
            px={2}
            key={coin.id}>
            <Box
              mb={{xs: 0, sm: 0, xl: 3}}
              color='text.primary'
              fontWeight={Fonts.BOLD}
              component='h3'
              fontSize={{xs: 18, sm: 20, xl: 22}}>
              {coin.value}
            </Box>
            <Box component='p' fontSize={{xs: 16, xl: 18}} color={indigo[200]}>
              {coin.name}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default CoinsInfo;
