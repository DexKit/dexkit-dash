import {providers} from 'ethers';
import {_TypedDataEncoder} from 'ethers/lib/utils';
import {ChainId} from 'types/blockchain';
import {GAME_METADATA_API} from '../constants';
import {GameMetadata} from '../utils/types';

export const GET_API_PREFIX = (chainId: ChainId) => {
  if (chainId === ChainId.Binance) {
    return `${ChainId.Binance}/`;
  }
  return '';
};

export const signUpdate = async (provider: any, chainId: ChainId) => {
  const pr = new providers.Web3Provider(provider);
  const signer = pr.getSigner();
  const domain = {
    name: 'Coinleague',
    version: '1',
    chainId: chainId,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  };

  const types = {
    Message: [
      {name: 'message', type: 'string'},
      {name: 'powered', type: 'string'},
    ],
  };
  const message = {
    message: 'Update my Game Metadata',
    powered: 'Powered By DexKit',
  };
  const populated = await _TypedDataEncoder.resolveNames(
    domain,
    types,
    message,
    (name: string) => {
      return provider.resolveName(name);
    },
  );
  const messageSigned = JSON.stringify(
    _TypedDataEncoder.getPayload(populated.domain, types, populated.value),
  );
  const sig = await signer._signTypedData(domain, types, message);
  return {sig, messageSigned};
};

export const update = (
  sig: string,
  message: string,
  data: any,
  room: string,
  id: string,
  account: string,
  chainId: ChainId = ChainId.Matic,
) => {
  const headers = new Headers({
    'content-type': 'application/json',
  });
  const myInit: RequestInit = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      owner: account,
      message: message,
      creator: account,
      signature: sig,
      room: room,
      title: data.title,
      description: data.description,
      smallDescription: data.smallDescription,
      chainId: chainId,
    }),
  };
  return fetch(`${GAME_METADATA_API}/api/${id}`, myInit);
};

export const remove = (
  sig: string,
  message: string,
  data: any,
  room: string,
  id: string,
  account: string,
  chainId: ChainId = ChainId.Matic,
) => {
  const headers = new Headers({
    'content-type': 'application/json',
  });
  const myInit: RequestInit = {
    method: 'DELETE',
    headers: headers,
    body: JSON.stringify({
      owner: account,
      message: message,
      creator: account,
      signature: sig,
      room: room,
      title: data.title,
      description: data.description,
      smallDescription: data.smallDescription,
      chainId: chainId,
    }),
  };
  return fetch(`${GAME_METADATA_API}/api/${id}`, myInit);
};

export const getGameMetadata = async (
  id: string,
  room: string,
  chainId: ChainId = ChainId.Matic,
) => {
  try {
    const response = await fetch(
      `${GAME_METADATA_API}/api/${room}/${GET_API_PREFIX(chainId)}${id}`,
    );
    if (response.ok && response.status === 200) {
      return (await response.json()) as GameMetadata;
    }
  } catch {
    return;
  }
};

export const getGamesMetadata = (
  ids: string,
  room: string,
  chainId: ChainId = ChainId.Matic,
) => {
  return fetch(
    `${GAME_METADATA_API}/api/${room}/all-games/${GET_API_PREFIX(
      chainId,
    )}${ids}`,
  )
    .then((r) => r.json())
    .then((r) => r as GameMetadata[]);
};

export const getAllGamesMetadata = (
  room: string,
  chainId: ChainId = ChainId.Matic,
) => {
  return fetch(
    `${GAME_METADATA_API}/api/${room}/${GET_API_PREFIX(chainId)}all-games`,
  )
    .then((r) => r.json())
    .then((r) => r as GameMetadata[]);
};
