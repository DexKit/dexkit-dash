import React, {useContext} from 'react';

import {useIntl} from 'react-intl';

import {AppContext} from '@crema';
import {Avatar, Grid, Typography} from '@material-ui/core';
// import Revenue from 'assets/images/dashboard/auther_sales.png';
// import SalesIcon from 'assets/images/dashboard/all_time_sales.png';
// import Comission from 'assets/images/dashboard/commission_sale.png';
import VolumeIcon from 'assets/images/metricsIcons/volume.png';
import MarkitIcon from 'assets/images/metricsIcons/market-cap.png';
import LowIcon from 'assets/images/metricsIcons/low-price.png';
import HighIcon from 'assets/images/metricsIcons/high-price.png';
import {CoinDetailCoinGecko} from 'types/coingecko';
import {useStyles} from './index.style';
import AppContextPropsType from 'types/AppContextPropsType';
import {Skeleton} from '@material-ui/lab';
import IntlMessages from '../../../../@crema/utility/IntlMessages';

interface Props {
  data: CoinDetailCoinGecko | undefined;
  loading?: boolean;
}

const CoingeckoMarket: React.FC<Props> = ({data, loading}) => {
  const {theme} = useContext<AppContextPropsType>(AppContext);
  const classes = useStyles(theme);
  const {messages} = useIntl();

  return (
    <Grid
      container
      justify='center'
      alignItems='center'
      alignContent='center'
      spacing={4}>
      <Grid item>
        <Grid container spacing={2} alignItems='center' alignContent='center'>
          <Grid item>
            <Avatar
              src={MarkitIcon}
              alt='icon'
              style={{height: 38, width: 38}}
            />
          </Grid>
          <Grid item>
            {loading ? (
              <>
                <Skeleton variant='text' width={50} />
                <Skeleton variant='text' width={50} />
              </>
            ) : (
              <>
                <Typography variant='caption'>
                  <IntlMessages id='app.dashboard.marketCap' />
                </Typography>
                <Typography variant='h5'>
                  ${data?.market_data?.market_cap?.usd ?? '-'}
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>

      <Grid item>
        <Grid container spacing={2} alignItems='center' alignContent='center'>
          <Grid item>
            <Avatar
              src={VolumeIcon}
              alt='icon'
              style={{height: 38, width: 38}}
            />
          </Grid>
          <Grid item>
            {loading ? (
              <>
                <Skeleton variant='text' width={50} />
                <Skeleton variant='text' width={50} />
              </>
            ) : (
              <>
                <Typography variant='caption'>
                  <IntlMessages id='app.dashboard.volume' />
                </Typography>
                <Typography variant='h5'>
                  ${data?.market_data?.total_volume?.usd ?? '-'}
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container spacing={2} alignItems='center' alignContent='center'>
          <Grid item>
            <Avatar src={HighIcon} alt='icon' style={{height: 38, width: 38}} />
          </Grid>
          <Grid item>
            {loading ? (
              <>
                <Skeleton variant='text' width={50} />
                <Skeleton variant='text' width={50} />
              </>
            ) : (
              <>
                <Typography variant='caption'>
                  <IntlMessages id='app.dashboard.24hourHigh' />
                </Typography>
                <Typography variant='h5'>
                  ${data?.market_data?.high_24h?.usd ?? '-'}
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container spacing={2} alignItems='center' alignContent='center'>
          <Grid item>
            <Avatar src={LowIcon} alt='icon' style={{height: 38, width: 38}} />
          </Grid>
          <Grid item>
            {loading ? (
              <>
                <Skeleton variant='text' width={50} />
                <Skeleton variant='text' width={50} />
              </>
            ) : (
              <>
                <Typography variant='caption'>
                  <IntlMessages id='app.dashboard.24hourHigh' />
                </Typography>
                <Typography variant='h5'>
                  ${data?.market_data?.low_24h?.usd ?? '-'}
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default CoingeckoMarket;
