import {useState} from 'react';
import useInterval from './useInterval';

export const useRefreshRate = (refreshRate?: number) => {
  const REFRESH_RATE_SECONDS = refreshRate || 60;
  const [refreshState, setRefreshState] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const doRefetch = () => {
    setRefreshState(!refreshState);
  };
  useInterval(() => {
    if (seconds < REFRESH_RATE_SECONDS) {
      setSeconds((seconds) => seconds + 1);
    } else {
      setSeconds(0);
      doRefetch();
    }
  }, 1000);

  return {
    refreshState,
    nextRefresh: (seconds / REFRESH_RATE_SECONDS) * 100,
    doRefetch,
  };
};
