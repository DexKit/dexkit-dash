import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import {
  addCustomNetwork,
  updateCustomNetwork,
  removeCustomNetwork,
  NetworkParams,
} from 'redux/_settingsv2/actions';

import * as settingTypes from 'modules/Settings/types';
import { AppNetworks, AppNetworkParams } from 'shared/constants/Networks';

export function useAppNetworks() {
  return Object.values(AppNetworks) as AppNetworkParams[];
}



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

  return { addNetwork, updateNetwork };
}

export function useCustomNetworkList() {
  const { networks } = useSelector<AppState, AppState['settingsv2']>(
    ({ settingsv2 }) => settingsv2,
  ) as { networks: settingTypes.Network[] }

  const appNetworksIds = Object.values(AppNetworks).map(n => n?.chainId);
  // Custom networks n
  const filteredNets = networks.filter(n => !appNetworksIds.includes(n.chainId))

  return { networks: filteredNets };
}

export function useRemoveCustomNetwork() {
  const dispatch = useDispatch();

  const removeNetwork = useCallback(
    (params: NetworkParams) => {
      dispatch(removeCustomNetwork(params));
    },
    [dispatch],
  );

  return { removeNetwork };
}
