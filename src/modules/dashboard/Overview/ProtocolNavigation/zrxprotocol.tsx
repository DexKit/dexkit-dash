import React from 'react';
import Card from '@material-ui/core/Card';

import {Box, Grid, Typography} from '@material-ui/core';
import {Fonts, EXCHANGE} from '../../../../shared/constants/AppEnums';
import InfoCard from 'shared/components/InfoCard';
import IconComponent from '@crema/core/Navigation/Icon';
import { IconProps } from "modules/routesConfig";

import ExploreIcon from '@material-ui/icons/Explore';
import MoneyIcon from '@material-ui/icons/Money';


const INFOR_CARD = [
  {
      value: "Token Explorer",
      bgColor: "#f3773d",
      icon: <MoneyIcon style={{fill: "white"}}/>,
      id: 2,
      type: "Last Month Sale",
      href: `/ethereum/protocol-explorer/${EXCHANGE.ZEROX}/token-explorer/${process.env.REACT_APP_DEFAULT_ETH_TOKEN_ZRX_PROTOCOL}`
  },
  {
      value: "Pair Explorer",
      bgColor: "#f3773d",
      icon:  <MoneyIcon style={{fill: "white"}}/>,
      id: 3,
      type: "Last Month Sale",
      href: `/ethereum/protocol-explorer/${EXCHANGE.ZEROX}/pair-explorer/${process.env.REACT_APP_DEFAULT_ETH_ZRX_PAIR}`
  },

]



const ProtocolNavigationZRXProtocol = () => {
  const icon: IconProps = {
    src: '0x.svg',
    type: 'svg'
  }


  return (
    <Box py={{xs: 5, sm: 5, xl: 5}} px={{xs: 6, sm: 6, xl: 6}} height='1' clone>
      <Card>
        <Box display='flex' alignItems='center' mb={2}>
            <Box mr={5} clone alignSelf='flex-start'>
                <IconComponent icon={icon} classes={{}}/>
            </Box>
            <Box ml={2}>
              <Typography component='h5' variant='inherit' color='inherit'>
                ZRX Protocol
              </Typography>
            
            </Box>
          </Box>
        {INFOR_CARD.map((state, index) => (
                <Grid item xs={12} sm={3} md={12} key={index} style={{marginBottom: "15px"}}>
                  <InfoCard state={state} icon={state.icon} />
                </Grid>
              ))}
      </Card>
    </Box>
  );
};

export default ProtocolNavigationZRXProtocol;