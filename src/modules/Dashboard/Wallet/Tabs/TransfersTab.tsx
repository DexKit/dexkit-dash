import Box from '@material-ui/core/Box';
import NoWallet from 'modules/ErrorPages/NoWallet';
import TransferListContainer from 'modules/History/TransferList/container';
import React, {useMemo, useState} from 'react';
import {useHistory} from 'react-router-dom';
import NetworkChips from 'shared/components/NetworkChips';

import {EthereumNetwork} from 'shared/constants/AppEnums';

type Props = {
  address?: string;
  networkName?: EthereumNetwork;
};

export const TransferTab = (props: Props) => {
  const history = useHistory();

  const searchParams = useMemo(() => {
    return new URLSearchParams(history.location.search);
  }, []);

  const {address, networkName} = props;

  return address && networkName ? (
    <TransferListContainer address={address} networkName={networkName} />
  ) : (
    <NoWallet />
  );
};
