import React, {useEffect, useState} from 'react';
import {countDownText} from 'utils/time_utils';
import moment from 'moment';

interface CountdownSpanProps {
  toDate: moment.Moment;
}

export function CountdownSpan(props: CountdownSpanProps) {
  const {toDate} = props;

  const [text, setText] = useState<string>('00:00:00');

  useEffect(() => {
    let interval = setInterval(() => {
      setText(countDownText(moment().utc(), toDate));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <>{text}</>;
}

export default CountdownSpan;
