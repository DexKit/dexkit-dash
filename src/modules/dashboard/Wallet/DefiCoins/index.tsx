import React from 'react';
import Grid from '@material-ui/core/Grid';
import CoinStats from './CoinStats';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import Box from '@material-ui/core/Box';
import { blue } from '@material-ui/core/colors';
import { Fonts } from '../../../../shared/constants/AppEnums';
import { CoinData } from '../../../../types/models/Crypto';
import { matchCoinSymbol } from 'utils/constants';

export interface CoinProps {
  token: string;
  coinsDataProps: CoinData;
}
export interface Assets {
  address: string;
  coinsData: CoinProps[];
}
export interface CoinsProps {
  assets: Assets[];
}

const DefiCoins: React.FC<CoinsProps> = ({ assets }) => {
  return (
    <Box key="defi-assets">
      <Box
        component='h2'
        color='text.primary'
        fontSize={16}
        mb={{ xs: 4, sm: 4, xl: 6 }}
        fontWeight={Fonts.BOLD}>
        <IntlMessages id='DEFI ASSETS' />
      </Box>
      {
        assets?.map(({ address, coinsData }: Assets, i) => {
          console.log('coinsData', coinsData);
          return (
            <Grid container spacing={2} key={address}>
              {
                coinsData?.map(({ token, coinsDataProps: coin }: CoinProps, index) => (
                  <Grid item xs={12} sm={4}>
                    <CoinStats
                      token={token}
                      icon={matchCoinSymbol(coin.symbol ?? '')}
                      bgColor={blue[500]}
                      data={coin}
                      heading={coin.name}
                    />
                  </Grid>

                ))
              }
            </Grid>
          )
        })
      }
    </Box>
  )
};

export default DefiCoins;
