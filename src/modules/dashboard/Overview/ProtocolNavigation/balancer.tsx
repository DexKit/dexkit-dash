import React, {useEffect, useState} from 'react';
import Card from '@material-ui/core/Card';

import {Box, Fade, Grid, Typography, Zoom} from '@material-ui/core';
import {Fonts, EXCHANGE} from '../../../../shared/constants/AppEnums';
import InfoCard from 'shared/components/InfoCard';
import IconComponent from '@crema/core/Navigation/Icon';
import {IconProps} from 'modules/routesConfig';
import ExploreIcon from '@material-ui/icons/Explore';
import MoneyIcon from '@material-ui/icons/Money';

export const INFOR_CARD = [
  {
    value: 'Token Explorer',
    bgColor: '#ff7149',
    icon: <MoneyIcon style={{fill: 'white'}} />,
    id: 2,
    type: 'Last Month Sale',
    href: `/ethereum/protocol-explorer/${EXCHANGE.BALANCER}/token-explorer/${process.env.REACT_APP_DEFAULT_ETH_TOKEN}`,
  },
  {
    value: 'Pair Explorer',
    bgColor: '#ff7149',
    icon: <ExploreIcon style={{fill: 'white'}} />,
    id: 3,
    type: 'Last Month Sale',
    href: `/ethereum/protocol-explorer/${EXCHANGE.BALANCER}/pair-explorer/${process.env.REACT_APP_ETH_KIT_PAIR}`,
  },
];

const ProtocolNavigationBalancer = () => {
  const balancerIcon: IconProps = {
    src: 'balancer.svg',
    type: 'svg',
  };

  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box className='card-hover'>
      <Fade in={shouldRender} timeout={1000}>
        <Box
          py={{xs: 5, sm: 5, xl: 5}}
          px={{xs: 6, sm: 6, xl: 6}}
          height='1'
          clone>
          <Card>
            <Box display='flex' alignItems='center' mb={5}>
              <Box mr={5} clone alignSelf='flex-start'>
                <IconComponent icon={balancerIcon} classes={{}} />
              </Box>
              <Box ml={2}>
                <Typography component='h5' variant='inherit' color='inherit'>
                  Balancer
                </Typography>
              </Box>
            </Box>
            <Grid spacing={3} container>
              {INFOR_CARD.map((state, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={12}
                  key={index}
                  style={{marginBottom: '7px'}}>
                  <InfoCard state={state} icon={state.icon} />
                </Grid>
              ))}
            </Grid>
          </Card>
        </Box>
      </Fade>
    </Box>
  );
};

export default ProtocolNavigationBalancer;
