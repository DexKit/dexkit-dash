import { useMagicProvider } from "hooks/provider/useMagicProvider";
import React, { useEffect } from "react";
import { useHistory } from "react-router";

import { getMagic, getCachedMagicNetwork } from "services/magic";



const  MagicCallbackSocial = () => {
  const {onConnectMagic} = useMagicProvider();
  const history = useHistory();

  useEffect(() => {
    // On mount, we try to login with a Magic credential in the URL query.
    const network =  getCachedMagicNetwork();
    const magic = getMagic(network)
    magic.oauth.getRedirectResult().finally(() => {
      history.push('/wallet');
      onConnectMagic()
    });
  }, []);

  return <></>;
}

export default MagicCallbackSocial;