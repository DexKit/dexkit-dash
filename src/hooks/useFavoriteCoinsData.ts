import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "redux/store";
import { getTokensById } from "services/rest/coingecko";
import { CoinItemCoinGecko } from "types/coingecko";
import useInterval from "./useInterval";



export const useFavoriteCoinsData = () => {
    const [data, setData] = useState<CoinItemCoinGecko[]>([]);
    const [loading, setLoading] = useState(true);

    const favoriteCoins = useSelector<AppState, AppState['ui']['favoriteCoins']>(state => state.ui.favoriteCoins);
   

    useInterval(() => {
        getTokensById(favoriteCoins.map(f=>f.id))
        .then(d => setData(d))
        .finally(()=> setLoading(false));
    },60000)

  

    return {data, loading}




}