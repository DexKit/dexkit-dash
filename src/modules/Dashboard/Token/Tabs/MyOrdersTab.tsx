import React from 'react';

import NoWallet from 'modules/ErrorPages/NoWallet';
import MyOrdersContainer from 'modules/History/MyOrdersHistory/container';

import {EthereumNetwork} from 'shared/constants/AppEnums';

type Props = {
  address?: string;
  networkName: EthereumNetwork;
};

export const MyOrdersTab = (props: Props) => {
  const {address, networkName} = props;

  return (
    <>
      {address && (
        <>
          <MyOrdersContainer address={address} networkName={networkName} />
        </>
      )}
      {!address && <NoWallet />}
    </>
  );
};
