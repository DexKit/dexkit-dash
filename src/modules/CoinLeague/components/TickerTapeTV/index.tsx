import React from 'react';

import { PriceFeeds } from 'modules/CoinLeagues/constants';
import { TickerTape } from 'react-ts-tradingview-widgets';
import { ChainId } from 'types/blockchain';


const TickerTapeTV = () => {


  const symbols = PriceFeeds[ChainId.Matic].concat(PriceFeeds[ChainId.Binance]).filter((s) => s.tv).map((s) => {
    return {
      proName: s.tv as string,
      title: (s.tv as string).split(':')[1],
    };
  });

  return (
    <>
      <TickerTape
        colorTheme='dark'
        symbols={symbols}
        isTransparent={true}
        displayMode={'compact'}></TickerTape>
    </>
  );
};
export default React.memo(TickerTapeTV);
