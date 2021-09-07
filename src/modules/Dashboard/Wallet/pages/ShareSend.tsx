import React, {useEffect, useState, useCallback, useMemo} from 'react';

import {Box} from '@material-ui/core';

import Sender from 'shared/components/TotalBalance/Sender';
import {useHistory} from 'react-router';

import {Token} from 'types/app';
import {useAllBalance} from 'hooks/balance/useAllBalance';
import {useSenderTokens} from 'hooks/useSenderTokens';

interface Props {}

export const ShareSend = (props: Props) => {
  const [token, setToken] = useState<Token>();

  const history = useHistory();

  const balances = useAllBalance();

  const {tokens} = useSenderTokens();

  const searchParams = useMemo(() => {
    return new URLSearchParams(history.location.search);
  }, []);

  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState(0.0);

  const handleResult = useCallback(
    (err?: any) => {
      history.push('/wallet');
    },
    [history],
  );

  useEffect(() => {
    let tokenAddress = searchParams.get('token');
    let networkName = searchParams.get('network');
    let toAddress = searchParams.get('address') || '';
    let sendAmount = parseFloat(searchParams.get('amount') || '0.0');

    setAmount(sendAmount);
    setAddress(toAddress);

    let index = tokens.findIndex(
      (t) => t.address === tokenAddress && t.networkName === networkName,
    );

    setToken(tokens[index]);
  }, [tokens, searchParams]);

  return (
    <Box>
      <Sender
        open
        amount={amount}
        token={token}
        onClose={() => {}}
        balances={balances.data}
        address={address}
        disableClose
        onResult={handleResult}
      />
    </Box>
  );
};

export default ShareSend;
