import React, {useContext} from 'react';
import {AppContext} from '@crema';
import {Box, Avatar} from '@material-ui/core';
import AppCard from '@crema/core/AppCard';
import {Fonts} from 'shared/constants/AppEnums';
// import Revenue from 'assets/images/dashboard/auther_sales.png';
// import SalesIcon from 'assets/images/dashboard/all_time_sales.png';
// import Comission from 'assets/images/dashboard/commission_sale.png';
import OrderIcon from 'assets/images/metricsIcons/order.png';
import VisitsIcon from 'assets/images/metricsIcons/visits.png';
import RevenueIcon from 'assets/images/metricsIcons/revenue.png';
import TrafficIcon from 'assets/images/metricsIcons/webtraffic.png';
import {CoinDetailCoinGecko} from 'types/coingecko';
import {useStyles} from './index.style';
import AppContextPropsType from 'types/AppContextPropsType';

interface Props {
  data: CoinDetailCoinGecko | undefined;
}

const CoingeckoMarket: React.FC<Props> = ({data}) => {
  const {theme} = useContext<AppContextPropsType>(AppContext);
  const classes = useStyles(theme);

  return (
    <Box className='card-hover'>
      <AppCard className={classes.appcard} height={1}>
        <Box className={classes.boxContainer}>
          <Box display='flex' flexDirection='column' alignItems='center'>
            <Box
              key={'drState-' + 'item.id'}
              pl={{xl: 6}}
              py={2}
              display='flex'
              alignItems='center'>
              <Avatar
                src={VisitsIcon}
                alt='icon'
                style={{height: 38, width: 38}}
              />

              <Box position='relative' ml={4}>
                <Box
                  component='h4'
                  display='inline-block'
                  fontWeight={Fonts.BOLD}
                  style={{padding: 0}}
                  mb={0.5}
                  fontSize={13}>
                  ${data?.market_data?.market_cap?.usd ?? '-'}
                </Box>
                <Box component='p' color='text.secondary' fontSize={11}>
                  Market Cap
                </Box>
              </Box>
            </Box>
          </Box>
          <Box display='flex' flexDirection='column' alignItems='center'>
            <Box
              key={'drState-' + 'item.id'}
              pl={{xl: 6}}
              py={2}
              display='flex'
              alignItems='center'>
              <Avatar
                src={RevenueIcon}
                alt='icon'
                style={{height: 38, width: 38}}
              />

              <Box position='relative' ml={4}>
                <Box
                  component='h4'
                  display='inline-block'
                  fontWeight={Fonts.BOLD}
                  style={{padding: 0}}
                  mb={0.5}
                  fontSize={13}>
                  ${data?.market_data?.low_24h?.usd ?? '-'}
                </Box>
                <Box component='p' color='text.secondary' fontSize={11}>
                  24 Hour Low
                </Box>
              </Box>
            </Box>
          </Box>
          <Box display='flex' flexDirection='column' alignItems='center'>
            <Box
              key={'drState-' + 'item.id'}
              pl={{xl: 6}}
              py={2}
              display='flex'
              alignItems='center'>
              <Avatar
                src={OrderIcon}
                alt='icon'
                style={{height: 38, width: 38}}
              />

              <Box position='relative' ml={4}>
                <Box
                  component='h4'
                  display='inline-block'
                  fontWeight={Fonts.BOLD}
                  style={{padding: 0}}
                  mb={0.5}
                  fontSize={13}>
                  ${data?.market_data?.total_volume?.usd ?? '-'}
                </Box>
                <Box component='p' color='text.secondary' fontSize={11}>
                  Volume
                </Box>
              </Box>
            </Box>
          </Box>
          <Box display='flex' flexDirection='column' alignItems='center'>
            <Box
              key={'drState-' + 'item.id'}
              pl={{xl: 6}}
              py={2}
              display='flex'
              alignItems='center'>
              <Avatar
                src={TrafficIcon}
                alt='icon'
                style={{height: 38, width: 38}}
              />

              <Box position='relative' ml={4}>
                <Box
                  component='h4'
                  display='inline-block'
                  fontWeight={Fonts.BOLD}
                  style={{padding: 0}}
                  mb={0.5}
                  fontSize={13}>
                  ${data?.market_data?.high_24h?.usd ?? '-'}
                </Box>
                <Box component='p' color='text.secondary' fontSize={11}>
                  24 Hour High
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </AppCard>
    </Box>
  );
};
export default CoingeckoMarket;
