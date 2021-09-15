import React, {useCallback, useState, useRef, useEffect} from 'react';

import {} from '@material-ui/core';
import moment, {Moment} from 'moment';

interface Props {
  price: number;
  endingDate: Moment;
  endingPrice: number;
  priceUSD: number;
  active: boolean;
}

export default (props: Props) => {
  const {active, price, endingPrice, priceUSD, endingDate} = props;

  const [priceText, setPriceText] = useState(0.0);

  const timer = useRef<any>();

  const countDown = useCallback(() => {
    if (active) {
      const diff = endingDate.diff(moment());
      const step = endingPrice / diff;

      setPriceText((price - step) * priceUSD);
    }
  }, [active, price, priceUSD, endingPrice, endingDate, timer.current]);

  useEffect(() => {
    timer.current = setInterval(() => {
      countDown();
    }, 1000);

    setPriceText(price);

    return () => {
      clearInterval(timer.current);
    };
  }, [price]);

  return <span>{priceText.toFixed(2)}</span>;
};
