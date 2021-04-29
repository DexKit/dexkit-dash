import React, { PropsWithChildren } from 'react';



import { RouteComponentProps } from 'react-router-dom';


import { EXCHANGE, NETWORK } from 'shared/constants/AppEnums';
import PairExplorerAMM from '../pair-explorer-amm';
import PairExplorer from '../pair-explorer';

type PropsParams = {
  address: string;
  exchange: EXCHANGE;
  networkName: NETWORK;
}


type Props = RouteComponentProps<PropsParams> & PropsWithChildren<PropsParams>;


const GenericPairExplorer: React.FC<Props> = (props) => {
  const {match: { params }} = props;
  const {networkName, exchange, address} = params;
  console.log(exchange);
  if(exchange === EXCHANGE.UNISWAP || exchange === EXCHANGE.SUSHISWAP){
    console.log('I am here');
    return <PairExplorerAMM   address={address} exchange={exchange} networkName={networkName}/> 
  }else{
    return <PairExplorer address={address} exchange={exchange} networkName={networkName}/> 
  }
 

};

export default GenericPairExplorer;
