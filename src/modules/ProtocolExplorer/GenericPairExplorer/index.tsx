import React, {PropsWithChildren} from 'react';
import {RouteComponentProps} from 'react-router-dom';

import {Box} from '@material-ui/core';
import InfoView from '../../../@crema/core/InfoView';

import {truncateAddress} from 'utils';
import {EXCHANGE, EthereumNetwork} from 'shared/constants/AppEnums';
import {GET_EXCHANGE_NAME} from 'shared/constants/Bitquery';
import PageTitle from 'shared/components/PageTitle';

import PairExplorerAMM from './PairExplorerAMM';
import PairExplorer from './PairExplorer';

type Params = {
  address: string;
  exchange: EXCHANGE;
  networkName: EthereumNetwork;
};

type Props = RouteComponentProps<Params> & PropsWithChildren<Params>;

const GenericPairExplorer: React.FC<Props> = (props) => {
  const {
    match: {params},
  } = props;

  const {networkName, exchange, address} = params;

  return (
    <>
      <Box pt={{xl: 4}}>
        <PageTitle
          address={address}
          history={
            exchange === EXCHANGE.ALL
              ? [
                  {
                    url: `/${networkName}/protocol-explorer/${exchange}/overview`,
                    name: 'Protocol Explorer',
                  },
                ]
              : [
                  {
                    url: `/${networkName}/protocol-explorer/${exchange}/overview`,
                    name: 'Protocol Explorer',
                  },
                  {
                    url: `/${networkName}/protocol-explorer/${exchange}/pair-explorer`,
                    name: GET_EXCHANGE_NAME(exchange),
                  },
                ]
          }
          active={`Pair Explorer`}
          title={
            exchange === EXCHANGE.ALL
              ? `Pair Explorer`
              : `Pair Explorer ${truncateAddress(address)}`
          }
        />

        {exchange === EXCHANGE.UNISWAP || exchange === EXCHANGE.SUSHISWAP ? (
          <PairExplorerAMM
            address={address}
            exchange={exchange}
            networkName={networkName}
          />
        ) : (
          <PairExplorer
            address={address}
            exchange={exchange}
            networkName={networkName}
          />
        )}
      </Box>

      <InfoView />
    </>
  );
};

export default GenericPairExplorer;
