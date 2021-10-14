import {MaticPriceFeeds} from 'modules/CoinLeagues/constants';
import React from 'react';
import {TickerTape} from 'react-ts-tradingview-widgets';

const TickerTapeTV = () => {
  const symbols = MaticPriceFeeds.filter(s=> s.tv).map((s) => {
    return {
      proName: s.tv as string,
      title: (s.tv as string).split(":")[1],
    };
  });
  return (
    <>
      <TickerTape colorTheme='dark' symbols={symbols} isTransparent={true} displayMode={'compact'}></TickerTape>
    </>
  );
};
export default React.memo(TickerTapeTV);
