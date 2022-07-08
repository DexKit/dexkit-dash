import {MaticPriceFeeds} from 'modules/CoinLeague/constants';
import React from 'react';
import {AdvancedRealTimeChart} from 'react-ts-tradingview-widgets';

interface Props {
  symbol?: string;
  height?: string;
  width?: string;
}

const ChartTV = (props: Props) => {
  const {symbol, height, width} = props;
  const symbols = MaticPriceFeeds.filter((s) => s.tv).map(
    (s) => s.tv,
  ) as string[];
  return (
    <>
      <AdvancedRealTimeChart
        symbol={symbol || symbols[0]}
        watchlist={symbols}
        height={height || '500px'}
        width={width || '700px'}
        theme={'dark'}
        details={true}
        hide_side_toolbar={true}
      />
    </>
  );
};
export default React.memo(ChartTV);
