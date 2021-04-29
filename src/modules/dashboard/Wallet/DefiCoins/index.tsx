import React, { useEffect, useState } from 'react';
import { GridContainer } from '@crema';
import IntlMessages from '@crema/utility/IntlMessages';
import { Grid, Box, Link, Typography } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { CoinData } from 'types/models/Crypto';
import { matchCoinSymbol } from 'utils/constants';
import CoinStats from './CoinStats';
import { Fonts } from 'shared/constants/AppEnums';


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

  const [defiData, setDefiData] = useState<CoinProps[]>([]);

  useEffect(() => {
    if (assets) {
      const defis: CoinProps[] = [];

      for(let asset of assets) {
        for(let coin of asset?.coinsData || []) {
          defis.push(coin);
        }
      }

      setDefiData(defis);
    }
  }, [assets])

  return (
    <Box key="defi-assets">
      <Box display='flex' alignItems='center'>
        <Box
          component='h2'
          color='text.primary'
          fontSize={16}
          mb={{ xs: 4, sm: 4, xl: 6 }}
          fontWeight={Fonts.BOLD}>
          <IntlMessages id='DEFI ASSETS' />
        </Box>
        <Box component='span' ml='auto'>
          <Link
            color='secondary'
            component='button'
            underline='none'>
            <IntlMessages id='common.viewAll' />
          </Link>
        </Box>
      </Box>

      <GridContainer>
      {
        defiData.length > 0 ? (
          defiData.slice(0, defiData.length > 9 ? 9 : defiData.length).map(({ token, coinsDataProps: coin }: CoinProps, index) => (
            <Grid item xs={4} sm={4}>
              <CoinStats
                key={index}
                token={token}
                icon={matchCoinSymbol(coin.symbol ?? '')}
                bgColor={blue[500]}
                data={coin}
                heading={coin.name}
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12} sm={12} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0px'}}>
            <Typography>You don't have DEFI Assets</Typography>
          </Grid>
        )
      }
      </GridContainer>
    </Box>
  )
};

export default DefiCoins;
