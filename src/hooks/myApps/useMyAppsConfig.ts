import { getConfig } from 'modules/MyApps/services/config';
import { useEffect, useState } from 'react';
import { ConfigResponse } from 'types/myApps';



export const useMyAppsConfig = (owner?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [configs, setConfigs] = useState<ConfigResponse[]>();
  const [fetch, setFetch] = useState(false);





  useEffect(() => {
    if (owner) {
      setLoading(true);
      setError(false);
      getConfig(owner)
        .then((c) => setConfigs(c))
        .catch((e) => setError(true))
        .finally(() => setLoading(false));
    }
  }, [owner, fetch]);

  const refetch = () => setFetch(!fetch);

  return { loading, error, configs, refetch };
};
