import React from 'react';
import Grid from '@material-ui/core/Grid';
import CoinStats from './CoinStats';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import Box from '@material-ui/core/Box';
import {blue, indigo, teal} from '@material-ui/core/colors';
import {Fonts} from '../../../../shared/constants/AppEnums';
import Aggregator from 'assets/images/aggregator.png';
import Marketplace from 'assets/images/marketplace.png';
import Exchange from 'assets/images/exchange.png';

const Coins: React.FC = () => {
  return (
    <Box>
      <Box
        component='h2'
        color='text.primary'
        fontSize={16}
        mb={{xs: 4, sm: 4, xl: 6}}
        fontWeight={Fonts.BOLD}>
        <IntlMessages id='app.myApps.currentCollectedTotalRewards' />
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4} md={6}>
          <CoinStats
            icon={Aggregator}
            bgColor={blue[500]}
            data={{
              name: 'Aggregator',
              price: '0',
              increment: 0,
            }}
            heading={<IntlMessages id='app.myApps.aggregator' />}
          />
        </Grid>

        <Grid item xs={12} sm={4} md={6}>
          <CoinStats
            icon={Marketplace}
            bgColor={indigo[700]}
            data={{
              name: 'Marketplace',
              price: '0',
              increment: 0,
            }}
            heading={<IntlMessages id='app.myApps.marketplace' />}
          />
        </Grid>

        <Grid item xs={12} sm={4} md={6}>
          <CoinStats
            icon={Exchange}
            bgColor={teal[600]}
            data={{
              name: 'Exchange',
              price: '0',
              increment: 0,
            }}
            heading={<IntlMessages id='app.myApps.exchange' />}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Coins;
