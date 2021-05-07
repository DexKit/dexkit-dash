import React, { PropsWithChildren } from 'react';
import Grid from '@material-ui/core/Grid';
import GridContainer from '../../../../@crema/core/GridContainer';

import Box from '@material-ui/core/Box';

import InfoCard from './InfoCard';

import OrdersTokens from './OrdersTokens';
import TokenOrders from 'modules/protocol-explorer/common/TokenOrders';
import { GET_DEFAULT_QUOTE } from 'shared/constants/Blockchain';
import { useChainId } from 'hooks/useChainId';
import { RouteComponentProps } from 'react-router-dom';
import { populateInforCard } from './populateInforCard';
import { GET_EXCHANGE_NAME } from 'shared/constants/Bitquery';
import { EXCHANGE, NETWORK } from 'shared/constants/AppEnums';
import PageTitle from 'shared/components/PageTitle';


interface OverviewProps {
  exchange: EXCHANGE;
  networkName: NETWORK;
}

type Props = RouteComponentProps<OverviewProps> & PropsWithChildren<OverviewProps>;

const Overview: React.FC<Props> = (props) => {
  const {currentChainId} = useChainId();
  const {match: { params }} = props;
  const { networkName, exchange } = params;

  return (
    <>
      <Box pt={{ xl: 4 }}>
        <PageTitle
          history={
            exchange == EXCHANGE.ALL ? [
              {url:`/${networkName}/protocol-explorer/${exchange}/overview`, name: 'Protocol Explorer'}
            ]:[
              {url:`/${networkName}/protocol-explorer/${exchange}/overview`, name: 'Protocol Explorer'},
              {url:`/${networkName}/protocol-explorer/${exchange}/overview`, name:  GET_EXCHANGE_NAME(exchange)}
            ]}
          active={`Overview`}
          title={`Protocol Explorer ${GET_EXCHANGE_NAME(exchange)}`}
        />

        <GridContainer>
          <Grid item xs={12} md={4}>
            <GridContainer>
              {
                populateInforCard(networkName, exchange).map((state, index) => (
                  <Grid item xs={12} sm={3} md={12} key={index}>
                    <InfoCard state={state} />
                  </Grid>
                ))
              }
            </GridContainer>
          </Grid>

          <Grid item xs={12} md={8}>
            <OrdersTokens networkName={networkName} exchange={exchange} />
          </Grid>

          <Grid item xs={12} md={12}>
             <TokenOrders networkName={NETWORK.ETHEREUM} baseAddress={null} quoteAddress={GET_DEFAULT_QUOTE(currentChainId)} exchange={exchange} type={'token'}/>
            </Grid> 
        </GridContainer>
      </Box>
    </>
  );
};

export default Overview;


