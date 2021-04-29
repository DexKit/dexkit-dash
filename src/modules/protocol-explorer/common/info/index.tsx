import React from 'react';

import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import {indigo} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/core/styles';

import { BalanceCoins } from 'types/models/Crypto';
import {   PairInfoExplorer } from 'types/app';

import CoinsInfo from './CoinsInfo';
import { useChainId } from 'hooks/useChainId';
import { CremaTheme } from 'types/AppContextPropsType';
import { Fonts } from 'shared/constants/AppEnums';
import AppCard from '@crema/core/AppCard';
import { ETHERSCAN_API_URL } from 'shared/constants/AppConst';


export interface Props {
  data: PairInfoExplorer;
}

const useStyles = makeStyles((theme: CremaTheme) => ({
  root: {
    backgroundColor: 'white',
    color: 'black',
    fontFamily: Fonts.LIGHT,
    textTransform: 'capitalize',
    width: 96,
    fontSize: 16,
    '&:hover, &:focus': {backgroundColor: 'white', color: 'black'},
    lineHeight: '16px',
    [theme.breakpoints.up('sm')]: {
      lineHeight: '20px',
    },
    [theme.breakpoints.up('xl')]: {
      lineHeight: '26px',
    },
  },
  btnPrimary: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    fontFamily: Fonts.LIGHT,
    textTransform: 'capitalize',
    width: 96,
    fontSize: 16,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
    },
    lineHeight: '16px',
    [theme.breakpoints.up('sm')]: {
      lineHeight: '20px',
    },
    [theme.breakpoints.up('xl')]: {
      lineHeight: '26px',
    },
  },
  textUppercase: {
    textTransform: 'uppercase',
  },
}));

const coinInfoFactory = (propsData: PairInfoExplorer): BalanceCoins[] => {
  return [
 
    {
      id: 1,
      name: 'Daily Volume',
      value: `$${propsData?.volume24InUsd.toFixed(0)}` ?? `$0`
    },
    { 
      id: 2,
      name: 'Total Trades (24 hrs)',
      value: `${propsData?.totalTrades.toFixed(0)}`  ?? `0`
    },
    {
      id: 3,
      name: `Amount ${propsData?.baseToken.symbol ?? '?'} (24 hrs)`,
      value: propsData?.baseAmount.toFixed(2) ?? 0
    },
    {
      id: 4,
      name: `Amount ${propsData?.quoteToken.symbol ?? '?'} (24 hrs)`,
      value: propsData?.quoteAmount.toFixed(2) ?? 0
    }
  ];
}

const Info: React.FC<Props> = (props) => {
  const classes = useStyles();
  const {currentChainId} = useChainId()

  const color = props.data.priceChange > 0 ? 'rgb(78, 228, 78)' : 'rgb(248, 78, 78)';

  

  return (
    <Box>

      <Box
        component='h2'
        color='text.primary'
        fontSize={16}
        className={classes.textUppercase}
        fontWeight={Fonts.BOLD}>
      </Box>

      <AppCard style={{backgroundColor: indigo[500]}}>
        <Box display='flex' flexDirection='column'>

          <Box display='flex' flexDirection='row' justifyContent='space-between'>
            <Box
              component='h3'
              color='primary.contrastText'
              fontWeight={Fonts.BOLD}
              fontSize={20}>
              {props.data.baseToken.symbol}/{props.data.quoteToken.symbol}
            </Box>
            
            <Box display='flex'>
              <Box mr={3}>
                <a href={`${ETHERSCAN_API_URL(currentChainId)}/address/${props.data.address}`} target="_blank">
                  <Avatar style={{color: '#3F51B5', backgroundColor: 'white', width: 34, height: 34 }} src="/images/etherescan.png"></Avatar>
                </a>             
              </Box>
              <Box mr={3}>
                <a href={`/dashboard/token/${props.data.baseToken.address}`}>
                  <Avatar style={{color: '#3F51B5', backgroundColor: 'white', width: 34, height: 34}}>T</Avatar>
                </a>
              </Box>
            </Box>    
          </Box>

          <Box display='flex' alignItems='center'>
            <Box
              component='h3'
              fontWeight={Fonts.MEDIUM}
              style={{color: color, marginTop: 13}}
              fontSize={20}>
              ${props.data.priceUsd.toFixed(4)}
            </Box>
          </Box>
          <Box display='flex' >
            <Box
              component='h3'
              fontWeight={Fonts.LIGHT}
              style={{color: color}}
              fontSize={13}>
              (24h {props.data.priceChange.toFixed(2)}%)
            </Box>
            <Box
              component='h3'
              fontWeight={Fonts.LIGHT}
              style={{color: 'white', marginLeft: 10}}
              fontSize={13}>
              {props.data.price.toFixed(8)} {props.data.quoteToken.symbol}
            </Box>
          </Box>

          <Box pt={{md: 2, lg: 3, xl: 6}}>
            <CoinsInfo coins={coinInfoFactory(props.data)} />
          </Box>

        </Box>
      </AppCard>

    </Box>
  );
};

export default Info;
