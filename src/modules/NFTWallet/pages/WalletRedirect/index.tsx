import {useDefaultAccount} from 'hooks/useDefaultAccount';
import React, {useEffect} from 'react';
import {useHistory} from 'react-router';
import {LOGIN_WALLET_ROUTE} from 'shared/constants/routes';

export default () => {
  // TODO: create a hook for future use?
  const userAccount = useDefaultAccount();
  const history = useHistory();

  useEffect(() => {
    if (userAccount) {
      history.replace(`/nfts/wallet/${userAccount}`);
    } else {
      history.replace(LOGIN_WALLET_ROUTE);
    }
  }, [userAccount, history]);

  return <></>;
};
