import axios from 'axios';
import {COINGECKO_URL} from 'shared/constants/AppConst';
import {
  CoinDetailCoinGecko,
  CoinItemCoinGecko,
  CoinListItemCoingecko,
} from 'types/coingecko';

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
  tokensMetadata: {address: string}[],
): Promise<{[address: string]: CoinItemCoinGecko}> {
  if (!coingeckoIdTokens) {
    coingeckoIdTokens = await getAllCoinsId();
  }

  const geckoData = coingeckoIdTokens
    .filter(
      (c) =>
        c.platforms.ethereum ||
        c.platforms['binance-smart-chain'] ||
        c.platforms['polygon-pos'],
    )
    .map((c) => {
      return {
        address_eth: c.platforms.ethereum?.toLowerCase() as string,
        address_bnb: c.platforms[
          'binance-smart-chain'
        ]?.toLowerCase() as string,
        address_polygon: c.platforms['polygon-pos']?.toLowerCase() as string,
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
      (a) =>
        addresses.includes(a.address_eth?.toLowerCase()) ||
        addresses.includes(a.address_bnb?.toLowerCase()) ||
        addresses.includes(a.address_polygon?.toLowerCase()),
    )
    .map((a) => a.id)
    .concat(['ethereum', 'binancecoin', 'matic-network']);

  const uniqueGeckoIds = [...new Set(geckoIds)];

  const geckoCoins = geckoData.filter(
    (a) =>
      addresses.includes(a.address_eth?.toLowerCase()) ||
      addresses.includes(a.address_bnb?.toLowerCase()) ||
      addresses.includes(a.address_polygon?.toLowerCase()),
  );

  const concatId = `${uniqueGeckoIds.reduce((p, c) => `${p},${c}`)}`;

  const coinsUsd = await getCoinsData(concatId);
  //const coinsNative = await getCoinsData(concatId, 'eth');

  const allCoins = geckoCoins
    .concat({
      address_eth: 'eth',
      address_bnb: '',
      address_polygon: '',
      id: 'ethereum',
      symbol: 'ETH',
    })
    .concat({
      address_eth: '',
      address_bnb: 'bnb',
      address_polygon: '',
      id: 'binancecoin',
      symbol: 'BNB',
    })
    .concat({
      address_eth: '',
      address_bnb: '',
      address_polygon: 'matic',
      id: 'matic-network',
      symbol: 'MATIC',
    });

  return allCoins.reduce<any>((acc, current) => {
    const address_eth = current.address_eth;
    const address_bnb = current.address_bnb;
    const address_polygon = current.address_polygon;
    if (address_eth) {
      acc[address_eth] = coinsUsd.find((c) => c.id === current.id);
    }
    if (address_bnb) {
      acc[address_bnb] = coinsUsd.find((c) => c.id === current.id);
    }
    if (address_polygon) {
      acc[address_polygon] = coinsUsd.find((c) => c.id === current.id);
    }

    // acc[current.address ?? 'eth'].currency_native = coinsNative.find(c=> c.id === current.id);
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
