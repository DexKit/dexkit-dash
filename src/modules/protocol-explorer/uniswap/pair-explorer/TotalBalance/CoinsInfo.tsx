import React from 'react';
import Box from '@material-ui/core/Box';
import {indigo} from '@material-ui/core/colors';
import {Fonts} from '../../../../../shared/constants/AppEnums';
import {BalanceCoins} from '../../../../../types/models/Crypto';

interface CoinsInfoProps {
  coins: BalanceCoins[];
}

const teste : { [key: string]: any } = {
  0: 'Total Liquidy',
  1: 'Daily Volume',
  2:'Pooled ETH',
  3: ' Pooled Kit'
}

// const TAG_NAME = ['Total Liquidy, Daily Volume, Pooled ETH, Pooled Kit']

const CoinsInfo: React.FC<CoinsInfoProps> = ({coins}) => {

  const newCoins = coins.map((coin, index) => ({...coin, name: `${index}`}))
  console.log('COINS', newCoins)

  return (
    <Box
      mx={-2}
      mb={{xl: 1}}
      display='flex'
      flexWrap='wrap'
      justifyContent='space-between'>
      {newCoins.map(coin => {
        return (
          <Box mt={{xl: 3}} px={2} key={coin.id}>
            <Box
              mb={{xs: 0, sm: 0, xl: 3}}
              color='primary.contrastText'
              fontWeight={Fonts.BOLD}
              component='h3'
              fontSize={20}>
              {coin.value}
            </Box>
            <Box component='p' fontSize={14} color={indigo[200]}>
              {teste[coin.name]}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default CoinsInfo;
