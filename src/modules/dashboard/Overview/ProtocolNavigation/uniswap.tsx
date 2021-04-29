import React from 'react';
import Card from '@material-ui/core/Card';

import {Box, Grid} from '@material-ui/core';
import {Fonts, EXCHANGE} from '../../../../shared/constants/AppEnums';
import InfoCard from 'shared/components/InfoCard';

export const INFOR_CARD = [
  {
      value: "Token Explorer",
      bgColor: "#49BD65",
      icon: "/assets/images/dashboard/1_monthly_sales.png",
      id: 2,
      type: "Last Month Sale",
      href: `/ethereum/protocol-explorer/${EXCHANGE.UNISWAP}/token-explorer/${process.env.REACT_APP_ETH_DEFAULT_TOKEN}`
  },
  {
      value: "Pool Explorer",
      bgColor: "#009dc4",
      icon: "/assets/images/dashboard/1_monthly_sales.png",
      id: 2,
      type: "Last Month Sale",
      href: `/ethereum/protocol-explorer/${EXCHANGE.UNISWAP}/pool-explorer/${process.env.REACT_APP_ETH_DEFAULT_PAIR}`
  },
  {
      value: "Pair Explorer",
      bgColor: "black",
      icon: "/assets/images/dashboard/1_monthly_sales.png",
      id: 3,
      type: "Last Month Sale",
      href: `/ethereum/protocol-explorer/${EXCHANGE.UNISWAP}/pair-explorer/${process.env.REACT_APP_ETH_DEFAULT_PAIR}`
  },

]


const ProtocolNavigationUniswap = () => {
  return (
    <Box py={{xs: 5, sm: 5, xl: 5}} px={{xs: 6, sm: 6, xl: 6}} height='1' clone>
      <Card>
        <Box mb={4} display='flex' alignItems='center'>
          <Box
            component='h2'
            fontFamily={Fonts.LIGHT}
            fontSize={{xs: 18, sm: 20, xl: 22}}>
           Uniswap Protocol
          </Box>
        </Box>
        {INFOR_CARD.map((state, index) => (
                <Grid item xs={12} sm={3} md={12} key={index} style={{marginBottom: "15px"}}>
                  <InfoCard state={state}/>
                </Grid>
              ))}
      </Card>
    </Box>
  );
};

export default ProtocolNavigationUniswap;