import axios from 'axios';
import {useCallback} from 'react';
import {COINGECKO_URL} from 'shared/constants/AppConst';

export function useTokenImage() {
  const getImage = useCallback(async () => {
    let response = await axios.get(COINGECKO_URL);
    let coins = response.data;
  }, []);

  return {getImage};
}
