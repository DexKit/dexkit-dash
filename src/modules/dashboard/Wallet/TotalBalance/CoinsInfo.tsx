import React from 'react';
import Box from '@material-ui/core/Box';
import {indigo} from '@material-ui/core/colors';
import {Fonts} from '../../../../shared/constants/AppEnums';
import {BalanceCoins} from '../../../../types/models/Crypto';

interface CoinsInfoProps {
  coins: BalanceCoins[];
}

const teste : { [key: string]: any } = {
  0: '1057214 KIT',
  1: '35.5 ETH',
  2:'548621 ZRX',
  3: '1000001 AAVE'
}

const CoinsInfo: React.FC<CoinsInfoProps> = ({coins}) => {
  return (
    <Box
      mx={-2}
      mb={{xl: 1}}
      display='flex'
      flexWrap='wrap'
      justifyContent='space-between'>
      {coins.map((coin, index) => {
        return (
          <Box mt={{xl: 3}} px={2} key={coin.id}>
            <Box
              mb={{xs: 0, sm: 0, xl: 3}}
              color='primary.contrastText'
              fontFamily={Fonts.LIGHT}
              component='h3'
              fontSize={{xs: 18, sm: 20, xl: 22}}>
              ${coin.value}
            </Box>
            <Box component='p' fontSize={{xs: 16, xl: 18}} color={indigo[200]}>
            {teste[index]}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default CoinsInfo;
