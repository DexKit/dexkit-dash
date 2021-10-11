import {useNetworkProvider} from 'hooks/provider/useNetworkProvider';
import {useWeb3} from 'hooks/useWeb3';
import {useCallback} from 'react';
import {useQuery} from 'react-query';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {ChainId, Web3State} from 'types/blockchain';
import {Kittygotchi} from 'types/kittygotchi';
import {GET_KITTY_CHAIN_ID, KITTYGOTCHI, METADATA_KITTY_ENDPOINT, PRICE} from '../constants';
import {
  getOnchainAttritbutes,
  feed,
  mint,
  signUpdate,
  update,
} from '../services/kittygotchi';

interface CallbackProps {
  onSubmit?: any;
  onConfirmation?: any;
  onError?: any;
}

export function useKittygotchi(id?: string) {
  const {chainId} = useWeb3();
  const provider = useNetworkProvider(
    EthereumNetwork.matic,
    GET_KITTY_CHAIN_ID(chainId),
  );
  const kittyAddress = KITTYGOTCHI[GET_KITTY_CHAIN_ID(chainId)];

  const query = useQuery(['GET_KITTYGOTCHI_META', id, chainId], () => {
    if (id && provider) {
      return fetch(`${METADATA_KITTY_ENDPOINT}${id}`)
        .then((r) => r.json())
        .then(async (r) => {
          const attr = await getOnchainAttritbutes(id, kittyAddress, provider);
          return {
            ...r,
            ...attr,
          } as Kittygotchi;
        });
    }
  });
  return query;
}

export function useKittygotchiList(ids?: string[]) {
  const {chainId} = useWeb3();
  const provider = useNetworkProvider(
    EthereumNetwork.matic,
    GET_KITTY_CHAIN_ID(chainId),
  );
  const kittyAddress = KITTYGOTCHI[GET_KITTY_CHAIN_ID(chainId)];

  const query = useQuery(['GET_KITTYGOTCHI_META_LIST', ids], async () => {
    if (ids) {
      const kitties = [];
      for (const id of ids) {
        try {
          const result = await fetch(`${METADATA_KITTY_ENDPOINT}${id}`)
            .then((r) => r.json())
            .then(async (r) => {
              const attr = await getOnchainAttritbutes(
                id,
                kittyAddress,
                provider,
              );
              return {
                ...r,
                ...attr,
              } as Kittygotchi;
            });
          kitties.push(result);
        } catch {}
      }
      return kitties;
    }
  });

  return query;
}

export function useKittygotchiFeed() {
  const {chainId, web3State, getProvider} = useWeb3();

  const kittyAddress = KITTYGOTCHI[GET_KITTY_CHAIN_ID(chainId)];

  const onFeedCallback = useCallback(
    async (id, callbacks?: CallbackProps) => {
      if (
        web3State !== Web3State.Done ||
        !chainId ||
        (chainId !== ChainId.Mumbai && chainId !== ChainId.Matic) ||
        !kittyAddress
      ) {
        return;
      }
      try {
        const tx = await feed(id, kittyAddress, getProvider());
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        console.log(e);
        callbacks?.onError(e);
      }
    },
    [web3State, chainId],
  );

  return {onFeedCallback};
}

export function useKittygotchiMint() {
  const {chainId, web3State, getProvider} = useWeb3();

  const kittyAddress = KITTYGOTCHI[GET_KITTY_CHAIN_ID(chainId)];

  const onMintCallback = useCallback(
    async (callbacks?: CallbackProps) => {
      if (
        web3State !== Web3State.Done ||
        !chainId ||
        (chainId !== ChainId.Mumbai && chainId !== ChainId.Matic) ||
        !kittyAddress
      ) {
        return;
      }
      try {
        const tx = await mint(kittyAddress, getProvider(), PRICE[chainId]);
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        callbacks?.onError(e);
      }
    },
    [web3State, chainId, kittyAddress],
  );

  return {onMintCallback};
}

export function useKittygotchiUpdate() {
  const {chainId, web3State, getProvider, account} = useWeb3();

  const kittyAddress = KITTYGOTCHI[GET_KITTY_CHAIN_ID(chainId)];

  const onUpdateKittyCallback = useCallback(
    async (kitty: Kittygotchi, callbacks?: CallbackProps) => {
      if (
        web3State !== Web3State.Done ||
        !chainId ||
        (chainId !== ChainId.Mumbai && chainId !== ChainId.Matic) ||
        !kittyAddress ||
        !account
      ) {
        return;
      }
      try {
        const {sig, messageSigned} = await signUpdate(getProvider(), chainId);
        callbacks?.onSubmit();
        await update(sig, messageSigned, kitty.attributes, kitty.id, account);
        callbacks?.onConfirmation();
      } catch (e) {
        callbacks?.onError(e);
      }
    },
    [web3State, chainId, account],
  );

  return {onUpdateKittyCallback};
}
