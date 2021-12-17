import { providers } from "ethers";
import { _TypedDataEncoder } from "ethers/lib/utils";
import { ChainId } from "types/blockchain";
import { GAME_METADATA_API } from "../constants";



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
      { name: 'message', type: 'string' },
      { name: 'powered', type: 'string' },
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
  return { sig, messageSigned };
};

export const update = (
  sig: string,
  message: string,
  data: any,
  room: string,
  id: string,
  account: string,
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
    }),
  };
  return fetch(`${GAME_METADATA_API}/api/${id}`, myInit);
};

export const getGameMetadata = (id: string, room: string) => {
  return fetch(`${GAME_METADATA_API}/api/${room}/${id}`).then(r => r.json());
}


export const getGamesMetadata = (ids: string, room: string) => {
  return fetch(`${GAME_METADATA_API}/api/${room}/all-games/${ids}`).then(r => r.json());
}

export const getAllGamesMetadata = (room: string) => {
  return fetch(`${GAME_METADATA_API}/api/${room}/all-games`).then(r => r.json());
}