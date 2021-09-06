import { useWeb3 } from "hooks/useWeb3";
import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { magic } from "services/magic";



const  MagicCallbackEmail = () => {
 const {onConnectWeb3} = useWeb3();
  const history = useHistory();

  useEffect(() => {
    // On mount, we try to login with a Magic credential in the URL query.

    magic.auth.loginWithCredential().finally(() => {
      history.push('/wallet');
      onConnectWeb3()
    });
  }, []);

  return <></>;
}

export default MagicCallbackEmail;