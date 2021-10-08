import React, {useCallback, useState} from 'react';

/**
 * use this hook to toggle dialogs
 * @param defaultState default state of the toggler
 * @returns
 */
export function useToggler(defaultState: boolean = false) {
  const [show, set] = useState(defaultState);

  const toggle = useCallback(() => {
    set((value) => !value);
  }, []);

  return {show, toggle, set};
}
