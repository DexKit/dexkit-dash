import {useState} from 'react';

import {COINS} from 'shared/constants/Coins';
import {Coin} from 'types/app';

export const useCoinList = () => {
  const [coins, setCoins] = useState<Coin[]>(COINS);
  return coins;
};
