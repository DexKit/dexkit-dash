import { useMagicProvider } from "hooks/provider/useMagicProvider";
import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { getMagic, getCachedMagicNetwork } from "services/magic";



const  MagicCallbackEmail = () => {
  const {onConnectMagic} = useMagicProvider();
  const history = useHistory();

  useEffect(() => {
    // On mount, we try to login with a Magic credential in the URL query.
    const network =  getCachedMagicNetwork();
    const magic = getMagic(network)
    magic.auth.loginWithCredential().finally(() => {
      history.push('/wallet');
      onConnectMagic()
    });
  }, []);

  return <></>;
}

export default MagicCallbackEmail;