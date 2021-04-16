import React from 'react';
import Box from '@material-ui/core/Box';
import CoinsInfo from './CoinsInfo';
import {indigo} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/core/styles';
import {Fonts} from '../../../../../shared/constants/AppEnums';
import AppCard from '../../../../../@crema/core/AppCard';
import {CremaTheme} from '../../../../../types/AppContextPropsType';
import Avatar from '@material-ui/core/Avatar';
import DeleteIcon from '@material-ui/icons/Delete';
import LockIcon from '@material-ui/icons/LockRounded'
import { BalanceCoins } from 'types/models/Crypto';
import { Link } from 'react-router-dom';
import { PairInfoExplorer } from 'types/app';


export interface Props {
  totalBalanceData: PairInfoExplorer;
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
      name: 'Total Liquidy',
      value: propsData?.liquidity.toFixed(2)  ?? 0
    },
    {
      id: 2,
      name: 'Daily Volume',
      value: propsData?.volume24.toFixed(2) ?? 0
    },
    {
      id: 3,
      name: `Pooled ${propsData?.baseToken.symbol ?? '?'}`,
      value: propsData?.basePooled.toFixed(2) ?? 0
    },
    {
      id: 4,
      name: `Pooled ${propsData?.quoteToken.symbol ?? '?'}`,
      value: propsData?.quotePooled.toFixed(2) ?? 0
    }
  ];
}

const Info: React.FC<Props> = (props) => {
  const classes = useStyles();

  return (
    <Box>
      <Box
        component='h2'
        color='text.primary'
        fontSize={16}
        className={classes.textUppercase}
        mb={{xs: 4, sm: 4, xl: 6}}
        fontWeight={Fonts.BOLD}>
      </Box>
      <AppCard style={{backgroundColor: indigo[500]}}>
        <Box
          mb={{xs: 3, md: 6, xl: 8}}
          display='flex'
          flexDirection={{xs: 'column', xl: 'row'}}
          alignItems={{xl: 'center'}}>
          <Box display='flex' flexDirection='row' justifyContent='space-between'>
            <Box
              component='h3'
              color='primary.contrastText'
              fontWeight={Fonts.BOLD}
              fontSize={20}>
              {props.totalBalanceData.baseToken.symbol}/{props.totalBalanceData.quoteToken.symbol}
            </Box>
            <Box display='flex'>
              <Box mr={3} clone>
                <a href={`https://etherscan.io/address/${props.totalBalanceData.address}`} target="_blank" rel="noopener noreferrer">
                  <Avatar style={{color: '#3F51B5', backgroundColor: 'white', width: 34, height: 34 }} src="/images/etherescan.png"></Avatar>
                </a>             
              </Box>
              <Box mr={3} clone>
                <a href={`https://info.uniswap.org/pair/${props.totalBalanceData.address}`} target="_blank" rel="noopener noreferrer">
                  <Avatar style={{color: '#3F51B5', backgroundColor: 'white', width: 34, height: 34}} src="/images/uniswap.png"></Avatar>
                </a>
              </Box>
            </Box>
          </Box>
          <Box display='flex' alignItems='center'>
            <Box
              component='h3'
              fontWeight={Fonts.MEDIUM}
              style={{color: '#4ee44e', marginTop: 13}}
              fontSize={20}>
                
              ${props.totalBalanceData.priceUsd.toFixed(4)}
            </Box>
          </Box>
          <Box display='flex' >
          <Box
              component='h3'
              fontWeight={Fonts.LIGHT}
              style={{color: '#4ee44e'}}
              fontSize={13}>
              (24h {props.totalBalanceData.priceChange.toFixed(2)}%)
            </Box>
            <Box
              component='h3'
              fontWeight={Fonts.LIGHT}
              style={{color: 'white', marginLeft: 10}}
              fontSize={13}>
              {props.totalBalanceData.price.toFixed(8)} {props.totalBalanceData.baseToken.symbol}
            </Box>
          </Box>
        </Box>
        {/* <Box
          component='p'
          mb={{xs: 3.5, md: 4, xl: 6}}
          fontSize={16}
          color={indigo[100]}>
          <IntlMessages id='Total Liquidy' />
        </Box> */}
        <Box pt={{md: 2, lg: 3, xl: 6}}>
          <CoinsInfo coins={coinInfoFactory(props.totalBalanceData)} />
        </Box>
      </AppCard>
    </Box>
  );
};

export default Info;
