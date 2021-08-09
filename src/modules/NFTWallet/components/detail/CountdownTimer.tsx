import {NULL_BYTES} from '@0x/order-utils';
import moment, {Moment} from 'moment';
import React, {useEffect, useRef, useState, useCallback} from 'react';

interface Props {
  dateTime: Moment;
}

export default (props: Props) => {
  const {dateTime} = props;

  const [text, setText] = useState('');

  const timerRef = useRef<any>();

  const countDown = useCallback(() => {
    const year = new Date().getFullYear();
    const difference = dateTime.diff(moment());
    let timeLeft: any = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)).toLocaleString(
          'en-US',
          {
            minimumIntegerDigits: 2,
            useGrouping: false,
          },
        ),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24).toLocaleString(
          'en-US',
          {
            minimumIntegerDigits: 2,
            useGrouping: false,
          },
        ),
        minutes: Math.floor((difference / 1000 / 60) % 60).toLocaleString(
          'en-US',
          {
            minimumIntegerDigits: 2,
            useGrouping: false,
          },
        ),
        seconds: Math.floor((difference / 1000) % 60).toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false,
        }),
      };
    } else {
      clearInterval(timerRef.current);
    }
    setText(
      `${timeLeft.days} days in ${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`,
    );
  }, [timerRef.current, dateTime]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      countDown();
    }, 1000);
  }, []);

  return <span>{text}</span>;
};
