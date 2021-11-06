import React, {useEffect, useState} from 'react';
import {countDownText} from 'utils/time_utils';
import moment from 'moment';

interface CountdownSpanProps {
  toDate: moment.Moment;
}

const EMPTY_COUNTER = '00:00:00';

export function CountdownSpan(props: CountdownSpanProps) {
  const {toDate} = props;

  const [text, setText] = useState<string>(EMPTY_COUNTER);

  /* eslint-disable */
  useEffect(() => {
    let interval = setInterval(() => {
      if (moment().utc().isAfter(toDate)) {
        setText(EMPTY_COUNTER);
        clearInterval(interval);
        return;
      }

      setText(countDownText(moment().utc(), toDate));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <>{text}</>;
}

export default CountdownSpan;
