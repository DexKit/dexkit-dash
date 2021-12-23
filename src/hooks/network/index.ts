import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import {
  addCustomNetwork,
  updateCustomNetwork,
  removeCustomNetwork,
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

export function useCustomNetworkList() {
  const {networks} = useSelector<AppState, AppState['settingsv2']>(
    ({settingsv2}) => settingsv2,
  );

  return {networks};
}

export function useRemoveCustomNetwork() {
  const dispatch = useDispatch();

  const removeNetwork = useCallback(
    (params: NetworkParams) => {
      dispatch(removeCustomNetwork(params));
    },
    [dispatch],
  );

  return {removeNetwork};
}
