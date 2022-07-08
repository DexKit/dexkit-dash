import {useDefaultAccount} from 'hooks/useDefaultAccount';
import React, {useEffect} from 'react';
import {useHistory} from 'react-router';

export default () => {
  const history = useHistory();

  const defaultAccount = useDefaultAccount();

  useEffect(() => {
    history.replace(`/coin-league/profile/${defaultAccount}`);
  }, [history, defaultAccount]);

  return <></>;
};
