import {DefiClient} from './defiSdkClient';
import {ProtocolBalanceInterface} from 'defi-sdk/src/protocols/interfaces';
import {AssetBalanceInterface} from 'defi-sdk/dist/protocols/interfaces';
import {
  Assets,
  CoinProps,
  CoinsProps,
} from 'modules/Dashboard/Wallet/DefiCoins';
import {CoinData} from 'types/models/Crypto';

export async function getDefiBalances(
  tokenAddress: string,
): Promise<ProtocolBalanceInterface[]> {
  return DefiClient.getAccountBalances(tokenAddress);
}

function balance2CoinsData(balances: AssetBalanceInterface[]): CoinProps[] {
  return balances.map((balance) => {
    const coinData: CoinData = {
      increment: Math.random(),
      name: balance.base.metadata.name,
      symbol: balance.base.metadata.symbol,
      price: balance.base.getAmount().toString(),
    };
    return {
      token: balance.base.metadata.address,
      coinsDataProps: coinData,
    } as CoinProps;
  });
}

export function parseDefiAssets(
  accountBalances: ProtocolBalanceInterface[],
): CoinsProps {
  const assets: Assets[] = [];
  accountBalances.forEach((protocols) => {
    assets.push(
      ...protocols.balances.map((_assets) => {
        return {
          address: _assets.metadata.address,
          coinsData: balance2CoinsData(_assets.balances),
        } as Assets;
      }),
    );
  });

  return {
    assets,
  } as CoinsProps;
}
