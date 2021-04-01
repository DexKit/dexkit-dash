import React from 'react';
import {makeStyles} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import {green, red} from '@material-ui/core/colors';
import {Fonts} from '../../../../shared/constants/AppEnums';
import AppCard from '../../../../@crema/core/AppCard';
import clsx from 'clsx';
import {CoinData} from '../../../../types/models/Crypto';
import {CremaTheme} from '../../../../types/AppContextPropsType';

const useStyles = makeStyles((theme: CremaTheme) => ({
  statsCard: {
    borderRadius: theme.overrides.MuiCardLg.root.borderRadius,
    padding: 10
  },
  root: {
    height: 30,
    width: 30,
    borderRadius: theme.overrides.MuiCardLg.root.borderRadius,
    backgroundColor: (props: {bgColor: string}) => props.bgColor,
    [theme.breakpoints.up('md')]: {
      height: 45,
      width: 45,
    },
    [theme.breakpoints.up('xl')]: {
      height: 70,
      width: 70,
    },
  },
}));

interface CoinStatsProps {
  icon: string;
  bgColor: string;
  data: CoinData;
  heading: any;
}

const CoinStats: React.FC<CoinStatsProps> = ({
  icon,
  bgColor,
  data,
  heading,
}) => {
  const classes = useStyles({bgColor});

  return (
    <AppCard className={clsx(classes.statsCard, 'card-hover')}>
      <Box display='flex' alignItems='center'>
        <Box p={2} fontSize={{xs: 18, md: 18}} clone>
          <Avatar className={classes.root}>
            <img alt='' src={icon} />
          </Avatar>
        </Box>
        <Box style={{marginLeft:5}} >
          <Box component='p'  fontSize={12} mb={2} color="#989898">
            {heading}
          </Box>
          <Box
            component='p'
            display='inline-block'
            fontSize={12}>
              <p style={{fontWeight: 'bold', fontSize: 16}}>
                ${data.price} 
                <Box
                  component='span'
                  ml={3}
                  style={{marginLeft: 7}}
                  textAlign="left"
                  fontSize={12}
                  fontWeight={Fonts.MEDIUM}
                  color={data.increment > 0.0 ? green[500] : red[500]}>
                  {data.increment}%
                </Box>
              </p>
          </Box>

        </Box>
        
      </Box>
    </AppCard>
  );
};

export default CoinStats;
