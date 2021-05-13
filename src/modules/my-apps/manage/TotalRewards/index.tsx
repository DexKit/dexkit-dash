import React from 'react';
import Grid from '@material-ui/core/Grid';
import CoinStats from './CoinStats';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import Box from '@material-ui/core/Box';
import {blue, indigo, teal} from '@material-ui/core/colors';
import {Fonts} from '../../../../shared/constants/AppEnums';
import Etherium from 'assets/images/etherium.png';
import Litcoin from 'assets/images/litcoin.png';
import Ripple from 'assets/images/ripple.png';

const Coins: React.FC = () => {
  return (
    <Box>
      <Box
        component='h2'
        color='text.primary'
        fontSize={16}
        mb={{xs: 4, sm: 4, xl: 6}}
        fontWeight={Fonts.BOLD}>
        <IntlMessages id='Current Collected Total Rewards' />
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4} md={6}>
          <CoinStats
            icon={Etherium}
            bgColor={blue[500]}
            data={{
              name: 'Etherium',
              price: '0',
              increment: 0,
            }}
            heading={<IntlMessages id='Aggregator' />}
          />
        </Grid>

        <Grid item xs={12} sm={4} md={6}>
          <CoinStats
            icon={Litcoin}
            bgColor={indigo[700]}
            data={{
              name: 'Litcoin',
              price: '0',
              increment: 0,
            }}
            heading={<IntlMessages id='Marketplace' />}
          />
        </Grid>

        <Grid item xs={12} sm={4} md={6}>
          <CoinStats
            icon={Ripple}
            bgColor={teal[600]}
            data={{
              name: 'Ripple',
              price: '0',
              increment: 0,
            }}
            heading={<IntlMessages id='Exchange' />}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Coins;
