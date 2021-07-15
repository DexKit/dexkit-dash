import {useDefaultAccount} from 'hooks/useDefaultAccount';
import React, {useEffect} from 'react';
import {useHistory} from 'react-router';

export default () => {
  // TODO: create a hook for future use?
  const userAccount = useDefaultAccount();
  const history = useHistory();

  useEffect(() => {
    if (userAccount) {
      history.replace(`/nfts/wallet/${userAccount}`);
    } else {
      history.replace('/connect-wallet');
    }
  }, [userAccount, history]);

  return <></>;
};
