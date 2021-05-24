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
import {makeStyles} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';

interface SalesStateProps {
  data: CoinDetailCoinGecko | undefined;
}

const useStyles = makeStyles((theme: CremaTheme) => ({
  appcard: {
    '& > div': {
      height: '100%',
    },
  },
  boxContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    height: '100%',
    '& > div': {
      flexBasis: '50%',
      minWidth: '120px',

      '& > div': {
        width: '120px',
      },
    },
  },
}));

const SalesState: React.FC<SalesStateProps> = ({data}) => {
  const classes = useStyles();

  return (
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
        <Box display='flex' flexDirection='column' alignItems='center'>
          <Box
            key={'drState-' + 'item.id'}
            pl={{xl: 6}}
            py={2}
            display='flex'
            alignItems='center'>
            <Avatar src={Revenue} alt='icon' style={{height: 38, width: 38}} />

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
        <Box display='flex' flexDirection='column' alignItems='center'>
          <Box
            key={'drState-' + 'item.id'}
            pl={{xl: 6}}
            py={2}
            display='flex'
            alignItems='center'>
            <Avatar src={Revenue} alt='icon' style={{height: 38, width: 38}} />

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
  );
};
export default React.memo(SalesState);
