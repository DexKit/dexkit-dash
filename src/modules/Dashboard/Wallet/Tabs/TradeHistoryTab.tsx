import NoWallet from 'modules/ErrorPages/NoWallet';
import TradeAllHistoryContainer from 'modules/History/TradeAllHistory/container';
import TradeHistoryContainer from 'modules/History/TradeHistory/container';
import React, {useMemo, useState} from 'react';
import {useHistory} from 'react-router-dom';
import NetworkChips from 'shared/components/NetworkChips';
import {EthereumNetwork} from 'shared/constants/AppEnums';

type Props = {
  address?: string;
  token?: string;
  enableNetworkChips?: boolean;
  networkName?: EthereumNetwork;
};

export const TradeHistoryTab = (props: Props) => {
  const history = useHistory();
  let searchParams = useMemo(() => {
    return new URLSearchParams(history.location.search);
  }, []);
  const [networkName, setNetworkName] = useState<EthereumNetwork>(
    (searchParams.get('network') as EthereumNetwork) ??
      props?.networkName ??
      EthereumNetwork.ethereum,
  );
  const {address, token, enableNetworkChips = true} = props;

  const onChangeNetwork = (net: EthereumNetwork | 'all') => {
    let searchParams = new URLSearchParams(history.location.search);
    searchParams.set('network', net);
    history.push({search: searchParams.toString()});
    setNetworkName(net as EthereumNetwork);
  };

  return (
    <>
      {address && (
        <>
          {enableNetworkChips && (
            <NetworkChips
              networkName={networkName}
              onClick={onChangeNetwork}
              enableAll={false}
            />
          )}
          {token && (
            <TradeHistoryContainer
              address={address}
              token={token}
              networkName={networkName}
            />
          )}
          {!token && (
            <TradeAllHistoryContainer
              address={address}
              networkName={networkName}
            />
          )}
        </>
      )}

      {!address && <NoWallet />}
    </>
  );
};
