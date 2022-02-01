import {providers} from 'ethers';
import {_TypedDataEncoder} from 'ethers/lib/utils';
import {ChainId} from 'types/blockchain';
import {PROFILE_API} from '../constants';
import {GameProfile} from '../utils/types';

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
    message: 'Create my Profile',
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

export const create = (
  sig: string,
  message: string,
  tokenAddress: string,
  tokenId: string,
  username: string,
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
      address: account,
      message: message,
      tokenAddress: tokenAddress,
      signature: sig,
      username: username,
      tokenId: tokenId,
      chainId: chainId,
    }),
  };
  return fetch(`${PROFILE_API}/create`, myInit);
};

export const createUsername = (
  sig: string,
  message: string,
  username: string,
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
      address: account,
      message: message,
      signature: sig,
      username: username,
      chainId: chainId,
    }),
  };
  return fetch(`${PROFILE_API}/create`, myInit);
};

export const remove = (sig: string, message: string, account: string) => {
  const headers = new Headers({
    'content-type': 'application/json',
  });
  const myInit: RequestInit = {
    method: 'DELETE',
    headers: headers,
    body: JSON.stringify({
      message: message,
      signature: sig,
    }),
  };
  return fetch(`${PROFILE_API}/${account}`, myInit);
};

export const getProfile = async (address: string) => {
  try {
    const response = await fetch(`${PROFILE_API}/${address}`);
    if (response.ok && response.status === 200) {
      return (await response.json()) as GameProfile;
    }
  } catch {
    return;
  }
};

/**
 *
 * @param addresses they are split by ','
 * @returns
 */
export const getProfiles = (addresses: string) => {
  return fetch(`${PROFILE_API}/all/${addresses}`)
    .then((r) => r.json())
    .then((r) => r as GameProfile[]);
};
