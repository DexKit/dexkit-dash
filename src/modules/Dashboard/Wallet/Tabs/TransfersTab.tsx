import NoWallet from 'modules/ErrorPages/NoWallet';
import TransferListContainer from 'modules/History/TransferList/container';
import React, {useMemo, useState} from 'react';
import {useHistory} from 'react-router-dom';

import {EthereumNetwork} from 'shared/constants/AppEnums';

type Props = {
  address?: string;
  networkName?: EthereumNetwork;
};

export const TransferTab = (props: Props) => {
  const history = useHistory();

  const {address} = props;

  const searchParams = useMemo(() => {
    return new URLSearchParams(history.location.search);
  }, [history.location.search]);

  /* eslint-disable */
  const [networkName, setNetworkName] = useState<EthereumNetwork>(
    (searchParams.get('network') as EthereumNetwork) ??
      EthereumNetwork.ethereum,
  );

  // const onChangeNetwork = (net: EthereumNetwork | 'all') => {
  //   const searchParams = new URLSearchParams(history.location.search);
  //   searchParams.set('network', net);
  //   history.push({search: searchParams.toString()});
  //   setNetworkName(net as EthereumNetwork);
  // };

  return address && networkName ? (
    <TransferListContainer address={address} networkName={networkName} />
  ) : (
    <NoWallet />
  );
};
