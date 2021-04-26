import React from 'react';
import Card from '@material-ui/core/Card';

import {Box, Grid} from '@material-ui/core';
import {Fonts} from '../../../../shared/constants/AppEnums';
import { INFOR_CARD } from 'modules/protocol-explorer/sushiswap/overview/Data';
import InfoCard from 'modules/protocol-explorer/uniswap/overview/InfoCard';



const ProtocolNavigationSushiSwap = () => {
  return (
    <Box py={{xs: 5, sm: 5, xl: 5}} px={{xs: 6, sm: 6, xl: 6}} height='1' clone>
      <Card>
        <Box mb={4} display='flex' alignItems='center'>
          <Box
            component='h2'
            fontFamily={Fonts.LIGHT}
            fontSize={{xs: 18, sm: 20, xl: 22}}>
           SushiSwap Protocol
          </Box>
        </Box>
        {INFOR_CARD.map((state, index) => (
                <Grid item xs={12} sm={3} md={12} key={index} style={{marginBottom: "15px"}}>
                  <InfoCard state={state} />
                </Grid>
              ))}
      </Card>
    </Box>
  );
};

export default ProtocolNavigationSushiSwap;