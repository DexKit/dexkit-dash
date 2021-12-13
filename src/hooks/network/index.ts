import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {
  addCustomNetwork,
  updateCustomNetwork,
  NetworkParams,
} from 'redux/_settingsv2/actions';

export function useAddCustomNetwork() {
  const dispatch = useDispatch();

  const addNetwork = useCallback(
    (params: NetworkParams) => {
      dispatch(addCustomNetwork(params));
    },
    [dispatch],
  );

  const updateNetwork = useCallback(
    (params: NetworkParams) => {
      dispatch(updateCustomNetwork(params));
    },
    [dispatch],
  );

  return {addNetwork, updateNetwork};
}
