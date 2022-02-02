import axios from 'axios';
import { COINGECKO_URL } from 'shared/constants/AppConst';
import { ChainId } from 'types/blockchain';
import {
  CoinDetailCoinGecko,
  CoinItemCoinGecko,
  CoinListItemCoingecko,
} from 'types/coingecko';
import { AssetPlatforms } from './constants';

const coinGecko = axios.create({
  baseURL: COINGECKO_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

async function getCoingecko(url: string) {
  try {
    const response = await coinGecko.get(url);
    return Promise.resolve(response.data);
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function getOverviewCoinsData(
  currency = 'usd',
): Promise<CoinItemCoinGecko[]> {
  return getCoingecko(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=dexkit,bitcoin,ethereum&sparkline=true`,
  );
}

export async function getDexkit(): Promise<CoinDetailCoinGecko> {
  return getCoingecko('dexkit?sparkline=true');
}

export async function getTokenById(id: string): Promise<CoinDetailCoinGecko> {
  return getCoingecko(
    `${id}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`,
  );
}

export async function getBitcoin(): Promise<CoinDetailCoinGecko> {
  return getCoingecko('bitcoin?sparkline=true');
}

export async function getEthereum(): Promise<CoinDetailCoinGecko> {
  return getCoingecko('ethereum?sparkline=true');
}

export async function getAllCoinsId(): Promise<CoinListItemCoingecko[]> {
  return getCoingecko(`list?include_platform=true`);
}

export async function getToken(address: string): Promise<CoinDetailCoinGecko> {
  return getCoingecko(
    `ethereum/contract/${address.toLowerCase()}?sparkline=true`,
  );
}

export async function getCoinsData(
  ids: string,
  currency = 'usd',
): Promise<CoinItemCoinGecko[]> {
  return getCoingecko(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${ids}&sparkline=true`,
  );
}

let coingeckoIdTokens: CoinListItemCoingecko[];

export async function getTokens(
  tokensMetadata: { address: string, chainId?: ChainId }[],
): Promise<{ [address: string]: CoinItemCoinGecko }> {
  if (!coingeckoIdTokens) {
    coingeckoIdTokens = await getAllCoinsId();
  }

  // const chainPlatforms = AssetPlatforms.filter(a=> a.chain_identifier).map(a=> a.id);
  const chainIds = tokensMetadata.filter(t => t.chainId).map(t => t.chainId);
  const supportedChainPlatforms = AssetPlatforms.filter(a => a.chain_identifier)
    .filter(a => chainIds.includes(a.chain_identifier as ChainId));
  const nativeCoinsCids = supportedChainPlatforms.filter(c => c?.c_id).map(c => c?.c_id as string);
  const supportedChainIds = supportedChainPlatforms.map(s => s.id);

  const geckoData = coingeckoIdTokens
    .filter(
      (c) =>
        c.platforms
    ).filter(c => Object.keys(c.platforms).filter(p => supportedChainPlatforms.map(a => a.id).includes(p)))
    .map((c) => {
      const platf: { [key: string]: string } = {};
      for (const pl of Object.keys(c.platforms)) {
        if (supportedChainIds.includes(pl)) {
          platf[`${pl}`] = c.platforms[pl] as string;
        }
      }
      return {
        platforms: platf,
        id: c.id,
        symbol: c.symbol,
      };
    });

  const addresses = tokensMetadata
    .map((t) => t.address)
    .map((ad) => ad.toLowerCase());
  // get only coins with active coingecko id

  const geckoIds = geckoData
    .filter(
      (a) => {
        let isPlatform = false;
        for (const platform of Object.keys(a.platforms)) {
          isPlatform = isPlatform || addresses.includes(a?.platforms[platform] || '')
        }
        return isPlatform;
      }
    )
    .map((a) => a.id)
    .concat(nativeCoinsCids);

  const uniqueGeckoIds = [...new Set(geckoIds)];

  const geckoCoins = geckoData.filter(
    (a) => {
      let isPlatform = nativeCoinsCids.includes(a.id);
      for (const platform of Object.keys(a.platforms)) {
        isPlatform = isPlatform || addresses.includes(a?.platforms[platform]?.toLowerCase())
      }
      return isPlatform;
    });

  const concatId = `${uniqueGeckoIds.reduce((p, c) => `${p},${c}`)}`;

  const coinsUsd = await getCoinsData(concatId);
  //const coinsNative = await getCoinsData(concatId, 'eth');

  return geckoCoins.reduce<any>((acc, current) => {
    for (const platform of Object.keys(current.platforms)) {
      const platf = current.platforms[platform]
      if (platf) {
        acc[platf] = coinsUsd.find((c) => c.id === current.id);
      }
    }
    if (nativeCoinsCids.includes(current.id)) {
      acc[current.symbol.toLowerCase()] = coinsUsd.find((c) => c.id === current.id);
    }
    return acc;
  }, {});

}

export async function getTokenCoingeckoItemList(
  address: string,
): Promise<CoinListItemCoingecko | null> {
  if (!coingeckoIdTokens) {
    coingeckoIdTokens = await getAllCoinsId();
  }

  const geckoData = coingeckoIdTokens.filter(
    (c) =>
      c.platforms.ethereum ||
      c.platforms['binance-smart-chain'] ||
      c.platforms['polygon-pos'],
  );
  const findToken = geckoData.find(
    (c) =>
      c?.platforms?.ethereum?.toLowerCase() === address.toLowerCase() ||
      c?.platforms['binance-smart-chain']?.toLowerCase() ===
      address.toLowerCase() ||
      c?.platforms['polygon-pos']?.toLowerCase() === address.toLowerCase(),
  );
  if (findToken) {
    return findToken;
  } else {
    return null;
  }
}

export async function getTokensById(
  ids: string[],
): Promise<CoinItemCoinGecko[]> {
  const concatId = `ethereum,binancecoin,matic-network${ids.reduce(
    (p, c) => `${p},${c}`,
    '',
  )}`;
  const coinsUsd = await getCoinsData(concatId);
  //const coinsNative = await getCoinsData(concatId, 'eth');
  return coinsUsd;
}
