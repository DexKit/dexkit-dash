import React, {PropsWithChildren} from 'react';
import {RouteComponentProps} from 'react-router-dom';

import {Box} from '@material-ui/core';
import InfoView from '../../../@crema/core/InfoView';

import {EXCHANGE, EthereumNetwork} from 'shared/constants/AppEnums';

import PairExplorerAMM from './PairExplorerAMM';
import PairExplorer from './PairExplorer';
import PageTitle from 'shared/components/PageTitle';
import {GET_EXCHANGE_NAME} from 'shared/constants/Bitquery';
import {truncateAddress} from 'utils';
import {TokenFilterProvider} from 'providers/protocol/tokenFilterProvider';

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
          breadcrumbs={{
            history:
              exchange === EXCHANGE.ALL
                ? [
                    {
                      url: `/${networkName}/protocol-explorer/${exchange}/overview`,
                      name: 'Pair Explorer',
                    },
                  ]
                : [
                    {
                      url: `/${networkName}/protocol-explorer/${exchange}/pair-explorer/${address}`,
                      name: 'Pair Explorer',
                    },
                    {
                      url: `/${networkName}/protocol-explorer/${exchange}/pair-explorer/${address}`,
                      name: GET_EXCHANGE_NAME(exchange),
                    },
                  ],
            active: {name: 'Pair Explorer'},
          }}
          title={{name: 'Pair Explorer'}}
          subtitle={{name: truncateAddress(address), hasCopy: address}}
          network={networkName}
        />

        <TokenFilterProvider>
          {exchange === EXCHANGE.UNISWAP ||
          exchange === EXCHANGE.SUSHISWAP ||
          exchange === EXCHANGE.PANCAKEV2 ? (
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
        </TokenFilterProvider>
      </Box>

      <InfoView />
    </>
  );
};

export default GenericPairExplorer;
