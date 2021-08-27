import React, {useEffect} from 'react';
import {RouteComponentProps, useHistory} from 'react-router-dom';
import {Box} from '@material-ui/core';

import PageTitle from 'shared/components/PageTitle';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {truncateAddress} from 'utils/text';

import TransferListContainer from './container';

type Params = {
  address: string;
  networkName: EthereumNetwork;
};

type Props = RouteComponentProps<Params>;

const TransferListPage: React.FC<Props> = (props) => {
  const {
    match: {params},
  } = props;
  const {address, networkName} = params;
  const history = useHistory();
  const account = useDefaultAccount();
  useEffect(() => {
    if (account && account !== address) {
      history.push(`/${networkName}/history/transfer/list/${account}`);
    }
  }, [account]);

  const onSwitchNetwork = (n: EthereumNetwork) => {
    history.push(`/${n}/history/transfer/list/${account}`);
  };

  return (
    <Box pt={{xl: 4}}>
      <Box display={'flex'}>
        <PageTitle
          breadcrumbs={{
            history: [
              {url: '/', name: 'Dashboard'},
              {url: '/wallet', name: 'Wallet'},
            ],
            active: {name: 'Transfers History'},
          }}
          title={{
            name: `Transfers History: ${truncateAddress(address)}`,
            hasCopy: address,
          }}
          networkSwitcher={{networkName, onClick: onSwitchNetwork}}
        />
      </Box>
      <TransferListContainer address={address} networkName={networkName} />
    </Box>
  );
};

export default TransferListPage;
