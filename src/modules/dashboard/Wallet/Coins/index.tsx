import React from 'react';
import Grid from '@material-ui/core/Grid';
import CoinStats from './CoinStats';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import Box from '@material-ui/core/Box';
import {blue, indigo, teal} from '@material-ui/core/colors';
import {Fonts} from '../../../../shared/constants/AppEnums';
import {CoinsDataProps} from '../../../../types/models/Crypto';
import Etherium from 'assets/images/etherium.png'
import Litcoin from 'assets/images/litcoin.png'
import Ripple from 'assets/images/ripple.png'

interface Props {
  coinsData: CoinsDataProps;
}

const Coins: React.FC<Props> = ({coinsData}) => {
  return (
    <Box>
      <Box
        component='h2'
        color='text.primary'
        fontSize={16}
        mb={{xs: 4, sm: 4, xl: 6}}
        fontWeight={Fonts.BOLD}>
        <IntlMessages id='DEFI ASSETS' />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <CoinStats
            icon={Etherium}
            bgColor={blue[500]}
            data={coinsData.etherium}
            heading={<IntlMessages id='BTC' />}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <CoinStats
            icon={Litcoin}
            bgColor={indigo[700]}
            data={coinsData.liteCoin}
            heading={<IntlMessages id='ETH' />}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <CoinStats
            icon={Ripple}
            bgColor={teal[600]}
            data={coinsData.ripple}
            heading={<IntlMessages id='FTC' />}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <CoinStats
            icon={Etherium}
            bgColor={blue[500]}
            data={coinsData.etherium}
            heading={<IntlMessages id='XRP' />}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <CoinStats
            icon={Litcoin}
            bgColor={indigo[700]}
            data={coinsData.liteCoin}
            heading={<IntlMessages id='BCH' />}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <CoinStats
            icon={Ripple}
            bgColor={teal[600]}
            data={coinsData.ripple}
            heading={<IntlMessages id='LCT' />}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <CoinStats
            icon={Ripple}
            bgColor={teal[600]}
            data={coinsData.ripple}
            heading={<IntlMessages id='ETC' />}
          />
        </Grid><Grid item xs={12} sm={3}>
          <CoinStats
            icon={Ripple}
            bgColor={teal[600]}
            data={coinsData.ripple}
            heading={<IntlMessages id='ABC' />}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Coins;
