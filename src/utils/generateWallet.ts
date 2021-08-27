import * as bip32 from 'bip32';
import * as bip39 from 'bip39';
import * as bitcoin from 'bitcoinjs-lib';
import * as browserpassworder from 'browser-passworder';

type GenWallet = (
  mnemonics: string[],
  passphrase: string,
  coin?: 'BTC' | 'DOGE',
) => Promise<{
  address: string, 
  encryptedSeed: string,
}>;

const generateWallet: GenWallet = async (mnemonics, passphrase, coin = 'BTC') => {
  const seed = bip39.mnemonicToSeedSync(mnemonics.join(' '), '');
  const encryptedSeed = await browserpassworder.encrypt(passphrase, {seed: seed});
 

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

  return {address: wallet.address as string, encryptedSeed: encryptedSeed};
};

export default generateWallet;
