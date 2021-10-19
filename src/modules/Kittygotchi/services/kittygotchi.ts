import {ContractTransaction, ethers, providers, BigNumber} from 'ethers';
import {_TypedDataEncoder} from '@ethersproject/hash';
import {getMulticallFromProvider} from 'services/multicall';
import {getEthers} from 'services/web3modal';
import {ChainId} from 'types/blockchain';
import {GAS_PRICE_MULTIPLIER, METADATA_KITTY_ENDPOINT} from '../constants';
import kittygotchiAbi from '../constants/ABI/kittygotchi.json';
import {Interface} from 'ethers/lib/utils';
import {CallInput} from '@indexed-finance/multicall';

export const getKittyGotchiContractSigner = async (
  address: string,
  provider: any,
) => {
  const pr = new providers.Web3Provider(provider).getSigner();
  return new ethers.Contract(address, kittygotchiAbi, pr);
};

export const getKittyGotchiContractNetwork = async (
  address: string,
  provider: any,
) => {
  const pr = new providers.Web3Provider(provider);
  return new ethers.Contract(address, kittygotchiAbi, pr);
};

export const feed = async (id: string, kittyAddress: string, provider: any) => {
  const ethers = getEthers();
  const gasPrice = await (
    await ethers?.getGasPrice()
  )?.mul(GAS_PRICE_MULTIPLIER);

  return (await getKittyGotchiContractSigner(kittyAddress, provider)).feed(id, {
    gasPrice,
    gasLimit: BigNumber.from(150000),
  }) as Promise<ContractTransaction>;
};

export const mint = async (
  kittyAddress: string,
  provider: any,
  price: BigNumber,
) => {
  const ethers = getEthers();
  const gasPrice = await (
    await ethers?.getGasPrice()
  )?.mul(GAS_PRICE_MULTIPLIER);
  console.log(price.toString());
  return (await getKittyGotchiContractSigner(kittyAddress, provider)).safeMint({
    gasPrice,
    value: price,
  }) as Promise<ContractTransaction>;
};

export const signUpdate = async (provider: any, chainId: ChainId) => {
  const pr = new providers.Web3Provider(provider);
  const signer = pr.getSigner();
  const domain = {
    name: 'KittyGotchi',
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
    message: 'Update my Gotchi!',
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

export const getOnchainAttritbutes = async (
  id: string,
  kittyAddress: string,
  provider: any,
) => {
  const iface = new Interface(kittygotchiAbi);
  const multicall = await getMulticallFromProvider(provider);
  const calls: CallInput[] = [];
  calls.push({
    interface: iface,
    target: kittyAddress,
    args: [id],
    function: 'getAttackOf',
  });
  calls.push({
    interface: iface,
    target: kittyAddress,
    args: [id],
    function: 'getRunOf',
  });
  calls.push({
    interface: iface,
    target: kittyAddress,
    args: [id],
    function: 'getDefenseOf',
  });
  calls.push({
    interface: iface,
    target: kittyAddress,
    args: [id],
    function: 'getLastUpdateOf',
  });
  const response = await multicall.multiCall(calls);
  const [, results] = response;
  return {
    attack: results[0],
    run: results[1],
    defense: results[2],
    lastUpdated: results[3],
  };
};

export const update = (
  sig: string,
  message: string,
  attributes: any,
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
      signature: sig,
      attributes: attributes,
    }),
  };
  return fetch(`${METADATA_KITTY_ENDPOINT}${id}`, myInit);
};
