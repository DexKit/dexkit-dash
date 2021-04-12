import React from 'react';
import {Grid, Box} from '@material-ui/core';
import {GridContainer} from '@crema';
import {RouteComponentProps} from 'react-router-dom';
import { Fonts } from 'shared/constants/AppEnums';
import Orders from './Orders';



type Params = {
  address: string
  type: 'account'|'token'|'contract'
};

type Props = RouteComponentProps<Params>

const OrderHistory: React.FC<Props> = (props) => { 
  const {match: { params }} = props;
  const {address, type} = params;
  
  return (
    <>
      <Box pt={{xl: 4}}>
        <GridContainer>
          <Grid item xs={12} md={12}>
            <Box
              component='h2'
              color='text.primary'
              fontSize={{xs: 18, sm: 20, xl: 22}}
              mb={{xs: 4, sm: 4, xl: 6}}
              fontFamily={Fonts.LIGHT}>
              ORDER HISTORY
            </Box>
          </Grid>
        </GridContainer>
        
        <GridContainer>
          <Grid item xs={12} md={12}>
            <Orders address={address} type={type} />
          </Grid>
        </GridContainer>
      </Box>
    </>
  );
};

export default OrderHistory;
