import React from 'react';
import Card from '@material-ui/core/Card';
import PopularCoinsTable from './PopularCoinsTable';
import {Box} from '@material-ui/core';
import {Fonts} from '../../../../shared/constants/AppEnums';
import {PopularCoinsData} from '../../../../types/models/Crypto';


interface PopularCoinsProps {
  popularCoins: PopularCoinsData[];
}

const PromoCoins: React.FC<PopularCoinsProps> = ({popularCoins}) => {
  return (
    <Box py={{xs: 5, sm: 5, xl: 5}} px={{xs: 6, sm: 6, xl: 6}} height='1' clone>
      <Card>
        <Box mb={4} display='flex' alignItems='center'>
          <Box
            component='h2'
            fontFamily={Fonts.LIGHT}
            fontSize={{xs: 18, sm: 20, xl: 22}}>
           Promo Coins
          </Box>
        </Box>
        <PopularCoinsTable popularCoins={popularCoins} />
      </Card>
    </Box>
  );
};

export default PromoCoins;
