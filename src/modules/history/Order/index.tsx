import React from 'react';
import {Grid, Box} from '@material-ui/core';
import {GridContainer} from '@crema';
import {RouteComponentProps} from 'react-router-dom';
import Orders from './Orders';
import PageTitle from 'shared/components/PageTitle';


type Params = {
  address: string
  type: 'account'|'token'|'contract'
};

type Props = RouteComponentProps<Params>

const OrderHistory: React.FC<Props> = (props) => { 
  const {match: { params }} = props;
  const {address, type} = params;
  
  return (
    <Box pt={{xl: 4}}>
      
      <PageTitle
        history={[
          {url:'/', name: 'Dashboard'},
          {url:'/dashboard/wallet', name: 'Wallet'}
        ]}
        active={'Order History'}
        title={'Order History'}
      />

      <GridContainer>
        <Grid item xs={12} md={12}>
          <Orders address={address} type={type} />
        </Grid>
      </GridContainer>

    </Box>
  );
};

export default OrderHistory;
