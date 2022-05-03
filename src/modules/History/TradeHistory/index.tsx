import React, {useEffect} from 'react';
import {RouteComponentProps, useHistory} from 'react-router-dom';
import {Box} from '@material-ui/core';

import PageTitle from 'shared/components/PageHeader';

import {truncateAddress} from 'utils/text';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {useCoingeckoTokenInfo} from 'hooks/useCoingeckoTokenInfo';
import TradeHistoryContainer from './container';

type Params = {
  address: string;
  token: string;
  networkName: EthereumNetwork;
};

type Props = RouteComponentProps<Params>;

const TradeHistoryPage: React.FC<Props> = (props) => {
  const {
    match: {params},
  } = props;
  const {address, token, networkName} = params;
  const account = useDefaultAccount();
  const history = useHistory();

  /* eslint-disable */
  useEffect(() => {
    if (account && account !== address) {
      if (token) {
        history.push(
          `/${networkName}/history/trade/list/${account}/token/${token}`,
        );
      } else {
        history.push(`/${networkName}/history/trade/list/${account}`);
      }
    }
  }, [account]);

  const {data: tokenData} = useCoingeckoTokenInfo(token, networkName);

  const onSwitchNetwork = (n: EthereumNetwork) => {
    history.push(`/${n}/history/trade/list/${account}`);
  };

  return (
    <Box pt={{xl: 4}}>
      {!token && (
        <PageTitle
          breadcrumbs={{
            history: [
              {url: '/', name: 'Dashboard'},
              {url: `/wallet`, name: 'Wallet'},
            ],
            active: {name: 'Trade History'},
          }}
          title={{
            name: `Trade History: ${truncateAddress(address)}`,
            hasCopy: address,
          }}
          networkSwitcher={{networkName, onClick: onSwitchNetwork}}
        />
      )}

      {token && (
        <PageTitle
          breadcrumbs={{
            history: [
              {url: '/', name: 'Dashboard'},
              {url: `/${networkName}/token/${token}`, name: 'Token'},
            ],
            active: {name: 'Trade History'},
          }}
          title={{
            name: `Trade History:  ${truncateAddress(address)}`,
            hasCopy: address,
          }}
        />
      )}

      {token && tokenData && (
        <PageTitle
          title={{name: tokenData.name}}
          subtitle={{name: truncateAddress(token), hasCopy: token}}
          icon={token}
        />
      )}

      <TradeHistoryContainer
        address={address}
        token={token}
        networkName={networkName}
      />
    </Box>
  );
};

export default TradeHistoryPage;
