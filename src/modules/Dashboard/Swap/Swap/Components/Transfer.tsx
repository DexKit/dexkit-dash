import React, {useState} from 'react';

import {useSingleBalance} from 'hooks/balance/useSingleBalance';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import Sender from 'shared/components/TotalBalance/Sender';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {ChangellyCoin} from 'types/changelly';

interface Props {
  coin: ChangellyCoin;
  amountToSend: number;
}

// At the moment we support only eth and bnb, to transfer directly from wallet
// Still in Progress
export const Transfer = (props: Props) => {
  const [senderModal, setSenderModal] = useState(false);
  const defaultAccount = useDefaultAccount();
  const {data} = useSingleBalance(
    'eth',
    EthereumNetwork.ethereum,
    defaultAccount,
  );

  return (
    data && (
      <Sender
        open={senderModal}
        onClose={() => setSenderModal(false)}
        balances={[data as any]}
        amount={props.amountToSend}
      />
    )
  );
};
