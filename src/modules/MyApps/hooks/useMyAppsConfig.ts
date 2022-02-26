
import { getConfig } from 'modules/MyApps/services/config';

import { useQuery } from 'react-query';


const QUERY_NAME = 'GET_MY_APPS_CONFIGS';

export const useMyAppsConfig = (owner?: string) => {

  const query = useQuery([QUERY_NAME, owner], async () => {
    if (owner) {
      return await getConfig(owner);
    }
  })

  return { loading: query.isLoading, error: query.isError, configs: query.data, refetch: query.refetch, query };
};
