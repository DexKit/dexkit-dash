import {BigNumber} from '@0x/utils';
import {Network} from 'types/blockchain';
import {CoinInterface} from '.';
import * as bip32 from 'bip32';
import * as bip39 from 'bip39';
import * as bitcoin from 'bitcoinjs-lib';
import * as browserpassworder from 'browser-passworder';

// https://github.com/bitpay/bitcore/blob/master/packages/bitcore-node/docs/api-documentation.md
const RPC_URL_MAINNET = 'https://api.bitcore.io/api/BTC/mainnet';
const RPC_URL_TESTNET = 'https://api.bitcore.io/api/BTC/testnet';
const RPC_URL = RPC_URL_MAINNET;

const bitcoin_network = bitcoin.networks.bitcoin;
const network = Network.bitcoin;
const privateKeys: {key: string; address: string; index: number}[] = [];
// Implementation based on https://github.com/swaponline/MultiCurrencyWallet/blob/master/src/common/coins/BTC.ts

const CoinService: CoinInterface = {
  precision: 8,
  //TODO: Test this on a testing folder, THIS WAS NOT TESTED, NOT USE
  transfer: (from: string, amount: BigNumber, to: string) => {
    const pk = CoinService.getPrivateKeyForAddress(from);
    if (!pk) {
      return;
    }
    const user = bitcoin.ECPair.fromPrivateKey(new Buffer(pk as string));
    const psbt = new bitcoin.Psbt();
    const unspents = CoinService.fetchUnspent(from);
    psbt.addInputs(unspents);
    psbt.addOutput({
      address: to,
      value: amount.toNumber(),
    });
    psbt.signAllInputs(user);
    psbt.finalizeAllInputs();
    const tx = psbt.extractTransaction().toHex();
    CoinService.sendTx(tx);
  },
  getBalance: async (address: string) => {
    const response = await fetch(`${RPC_URL}/address/${address}/balance`);
    const json = await response.json();
    const balanceSat = json.balance;
    const balanceBTC = new BigNumber(balanceSat).dividedBy(
      10 ** CoinService.precision,
    );
    return balanceBTC;
  },
  getAddress: (index: number = 0) => {
    if (privateKeys.length > index) {
      return privateKeys[index].address;
    } else {
      return false;
    }
  },
  getTransactions: (address: string) => {
    return CoinService.fetchAddressTransactions(address);
  },
  getNetwork: () => {
    return network;
  },
  getPrivateKey: (index: number = 0) => {
    if (privateKeys.length > index) {
      return privateKeys[index].key;
    } else {
      return false;
    }
  },
  getPrivateKeyForAddress: (address: string) => {
    const pk = privateKeys.find(
      (p) => p.address.toLowerCase() === address?.toLowerCase(),
    );
    if (pk) {
      return pk.key;
    } else {
      return false;
    }
  },
  setPrivateKey: async (
    encryptedSeed: string,
    passphrase: string,
    index: number = 0,
  ) => {
    const seed = (await browserpassworder.decrypt(passphrase, encryptedSeed))
      .seed;
    const root = bip32.fromSeed(new Buffer(seed), bitcoin_network);
    const {publicKey, privateKey} = root
      .derivePath(CoinService.getPath())
      .derive(0)
      .derive(index);
    const wallet = bitcoin.payments.p2pkh({
      pubkey: publicKey,
      network: bitcoin_network,
    });
    const pk = privateKeys.find(
      (p) => p.address.toLowerCase() === wallet?.address?.toLowerCase(),
    );
    if (pk) {
      return false;
    } else {
      privateKeys.push({
        key: privateKey?.toString() as string,
        address: wallet?.address as string,
        index,
      });
      return wallet?.address;
    }
  },
  getPath: () => {
    return `m/49'/0'/0'/0`;
  },
  sendTx: async (rawTx: string) => {
    const response = await fetch(`${RPC_URL}/tx/send`, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({rawTx: rawTx}),
    });
    const json = await response.json();
    return json;
  },
  fetchUnspent: async (address: string) => {
    const response = await fetch(`${RPC_URL}/addr/${address}/utxo`);

    if (response.status !== 200) {
      throw new Error(
        `Can't fetch unspents - ${response.status}, ${response.statusText}`,
      );
    }
    const json = await response.json();
    return json;
  },
  fetchAddressTransactions: async (address: string) => {
    const response = await fetch(`${RPC_URL}/addr/${address}/txs`);

    if (response.status !== 200) {
      throw new Error(
        `Can't fetch unspents - ${response.status}, ${response.statusText}`,
      );
    }
    const json = await response.json();
    return json;
  },
  getCoinData: () => {
    return {
      name: 'Bitcoin',
      symbol: 'BTC',
      networkName: Network.bitcoin,
      decimals: CoinService.precision,
      displayDecimals: 4,
      icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
      coingecko_id: 'bitcoin',
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
    };
  },
};

export default CoinService;
