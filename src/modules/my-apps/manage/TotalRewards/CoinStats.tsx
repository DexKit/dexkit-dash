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
    // padding: 10,
    padding: 0,
  },
  root: {
    height: 50,
    width: 50,
    // height: 30,
    // width: 30,
    borderRadius: theme.overrides.MuiCardLg.root.borderRadius,
    backgroundColor: (props: {bgColor: string}) => props.bgColor,
    // [theme.breakpoints.up('md')]: {
    //   height: 45,
    //   width: 45,
    // },
    // [theme.breakpoints.up('xl')]: {
    //   height: 70,
    //   width: 70,
    // },
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
      <Box padding={{xs: 3, md: 5, lg: 3}} display='flex' alignItems='center'>
        <Avatar className={classes.root}>
          <img alt='' src={icon} />
        </Avatar>
        <Box ml={2}>
          <Box
            component='p'
            fontSize={{xs: 12, sm: 12, xl: 13}}
            mb={2}
            color='#989898'>
            {heading}
          </Box>
          <Box
            component='p'
            display='inline-block'
            fontSize={{xs: 16, sm: 16, xl: 18}}>
            <p style={{fontWeight: 'bold'}}>
              ${data.price}
              <Box
                component='span'
                ml={2}
                textAlign='left'
                fontSize={{xs: 13, sm: 13, xl: 14}}
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
