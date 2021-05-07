import React from 'react';
import Box from '@material-ui/core/Box';
import {Fonts} from '../../../../shared/constants/AppEnums';
import GridContainer from '../../../../@crema/core/GridContainer';
import Grid from '@material-ui/core/Grid';
import AppCard from '../../../../@crema/core/AppCard';
import Avatar from '@material-ui/core/Avatar';
import Revenue from 'assets/images/dashboard/auther_sales.png';
import SalesIcon from 'assets/images/dashboard/all_time_sales.png';
import Comission from 'assets/images/dashboard/commission_sale.png';
import {CoinDetailCoinGecko} from 'types/coingecko';

interface SalesStateProps {
  data: CoinDetailCoinGecko | undefined;
}

const SalesState: React.FC<SalesStateProps> = ({data}) => {
  return (
    <AppCard height={1}>
      {/* <GridContainer style={{marginTop: 20}}> */}
      <GridContainer>
        <Grid style={{padding: 0}} item xs={6} sm={6}>
          <Box
            width={1}
            ml={2}
            style={{padding: 0}}
            display='flex'
            flexDirection='column'
            alignItems='flex-start'>
            <Box
              key={'drState-' + 'item.id'}
              pl={{xl: 6}}
              py={2}
              display='flex'
              alignItems='center'>
              <Avatar
                src={SalesIcon}
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
        </Grid>
        <Grid style={{padding: 0}} item xs={6} sm={6}>
          <Box
            width={1}
            ml={2}
            style={{padding: 0}}
            display='flex'
            flexDirection='column'
            alignItems='flex-start'>
            <Box
              key={'drState-' + 'item.id'}
              pl={{xl: 6}}
              py={2}
              display='flex'
              alignItems='center'>
              <Avatar
                src={Revenue}
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
        </Grid>
        <Grid style={{padding: 0}} item xs={6} sm={6}>
          <Box
            width={1}
            ml={2}
            style={{padding: 0}}
            display='flex'
            flexDirection='column'
            alignItems='flex-start'>
            <Box
              key={'drState-' + 'item.id'}
              pl={{xl: 6}}
              py={2}
              display='flex'
              alignItems='center'>
              <Avatar
                src={Comission}
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
        </Grid>
        <Grid style={{padding: 0}} item xs={6} sm={6}>
          <Box
            width={1}
            ml={2}
            style={{padding: 0}}
            display='flex'
            flexDirection='column'
            alignItems='flex-start'>
            <Box
              key={'drState-' + 'item.id'}
              pl={{xl: 6}}
              py={2}
              display='flex'
              alignItems='center'>
              <Avatar
                src={Revenue}
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
        </Grid>
      </GridContainer>
    </AppCard>
  );
};
export default React.memo(SalesState);
