import React, {useCallback, useState, useRef, useEffect} from 'react';

import {} from '@material-ui/core';
import moment, {Moment} from 'moment';

interface Props {
  price: number;
  createdDate: Moment;
  endingDate: Moment;
  endingPrice: number;
  active: boolean;
}

export default (props: Props) => {
  const {active, price, endingPrice, createdDate, endingDate} = props;

  const [priceText, setPriceText] = useState(0.0);

  const timer = useRef<any>();

  const [count, setCount] = useState(1);

  const countDown = useCallback(() => {
    if (active) {
      const diff = endingDate.diff(moment(), 'seconds', true);

      const diffTotal = createdDate.diff(endingDate, 'seconds', true);
      const priceBySecond = price / diffTotal;

      setPriceText(Math.abs(priceBySecond * diff));
    }
  }, [
    count,
    active,
    price,
    endingPrice,
    endingDate,
    createdDate,
    timer.current,
  ]);

  useEffect(() => {
    timer.current = setInterval(() => {
      countDown();
    }, 1000);

    setPriceText(price);

    return () => {
      clearInterval(timer.current);
    };
  }, [price]);

  return <span>{priceText}</span>;
};
