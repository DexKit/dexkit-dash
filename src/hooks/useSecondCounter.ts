import {useState} from 'react';
import useInterval from './useInterval';

export const useSecondCounter = (nextResetTime?: number) => {
  const [seconds, setSeconds] = useState(0);
  useInterval(() => {
    setSeconds((seconds) => seconds + 1);
  }, 1000);

  return {
    seconds,
    setSeconds,
    nextRefresh: (seconds / (nextResetTime || 1)) * 100,
  };
};
