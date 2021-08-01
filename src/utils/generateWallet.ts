import * as bip32 from 'bip32';
import * as bip39 from 'bip39';
import * as bitcoin from 'bitcoinjs-lib';

type GenWallet = (
  mnemonics: string[],
  passphrase: string,
  coin?: 'BTC' | 'DOGE',
) => string;

const generateWallet: GenWallet = (mnemonics, passphrase, coin = 'BTC') => {
  const seed = bip39.mnemonicToSeedSync(mnemonics.join(' '), passphrase);

  let path: string = '';
  let network;
  switch (coin) {
    case 'BTC':
      path = `m/49'/0'/0'/0`;
      network = bitcoin.networks.bitcoin;
      break;
    case 'DOGE':
      break;
    default:
      path = `m/49'/0'/0'/0`;
      network = bitcoin.networks.bitcoin;
  }

  const root = bip32.fromSeed(seed, network);
  const {publicKey} = root.derivePath(path).derive(0).derive(0);
  const wallet = bitcoin.payments.p2pkh({pubkey: publicKey, network: network});

  return wallet.address as string;
};

export default generateWallet;
