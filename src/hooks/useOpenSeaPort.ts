import { OpenSeaPort } from "opensea-js";
import { useEffect, useState } from "react";
import { useWeb3 } from "./useWeb3";



export default () => {
  
  const { getProvider, account } = useWeb3();
  const [openSeaPort, setOpenSeaPort] = useState<OpenSeaPort>();

  useEffect(() => {
    if (account) {
      let provider = getProvider();
      let newOpenSeaPort = new OpenSeaPort(provider);

      setOpenSeaPort(newOpenSeaPort);
    }
  }, [account, getProvider]);

  return { openSeaPort };
};