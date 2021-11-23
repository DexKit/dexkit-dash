import {MaticPriceFeeds} from 'modules/CoinLeagues/constants';
import React from 'react';
import {AdvancedRealTimeChart} from 'react-ts-tradingview-widgets';

const ChartTV = () => {
  const symbols = MaticPriceFeeds.filter((s) => s.tv).map(
    (s) => s.tv,
  ) as string[];
  return (
    <>
      <AdvancedRealTimeChart
        symbol={symbols[0]}
        watchlist={symbols}
        theme={'dark'}
        details={true}
        hide_side_toolbar={true}
      />
    </>
  );
};
export default React.memo(ChartTV);
