import React from 'react';
import Box from '@material-ui/core/Box';
import CoinsInfo from './CoinsInfo';
import {indigo} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/core/styles';
import {Fonts} from '../../../../../shared/constants/AppEnums';
import AppCard from '../../../../../@crema/core/AppCard';
import {TotalBalanceData} from '../../../../../types/models/Crypto';
import {CremaTheme} from '../../../../../types/AppContextPropsType';
import Avatar from '@material-ui/core/Avatar';
import DeleteIcon from '@material-ui/icons/Delete';


interface TotalBalanceProps {
  totalBalanceData: TotalBalanceData;
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

const TotalBalance: React.FC<TotalBalanceProps> = ({totalBalanceData}) => {
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
              ETH/KIT
            </Box>
            <Box display='flex'  >
            <Box mr={3} clone>
            <Avatar style={{color: '#3F51B5',
              backgroundColor: 'white'}}>
            <DeleteIcon />
            </Avatar>
          </Box>
          <Box mr={3} clone>
            <Avatar style={{color: '#3F51B5',
              backgroundColor: 'white'}}>
            <DeleteIcon />
            </Avatar>
          </Box>
          <Box mr={3} clone>
            <Avatar style={{color: '#3F51B5',
              backgroundColor: 'white'}}>
            <DeleteIcon />
            </Avatar>
          </Box>
            </Box>
          </Box>
          <Box display='flex' alignItems='center'>
            <Box
              component='h3'
              fontWeight={Fonts.MEDIUM}
              style={{color: '#4ee44e', marginTop: 13}}
              fontSize={20}>
                
              {totalBalanceData.balance}
            </Box>
          </Box>
          <Box display='flex' >
          <Box
              component='h3'
              fontWeight={Fonts.LIGHT}
              style={{color: '#4ee44e'}}
              fontSize={13}>
              (24h 1,51%)
            </Box>
            <Box
              component='h3'
              fontWeight={Fonts.LIGHT}
              style={{color: 'white', marginLeft: 10}}
              fontSize={13}>
              {totalBalanceData.balance}
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
          <CoinsInfo coins={totalBalanceData.coins} />
        </Box>
      </AppCard>
    </Box>
  );
};

export default TotalBalance;
