import {Typography} from '@material-ui/core';

import moment from 'moment';

interface KittyFeedCountDownProps {
  countTo: number;
}

export const KittyFeedCountDown = (props: KittyFeedCountDownProps) => {
  const {countTo} = props;

  return (
    <Typography variant='body1'>{moment(countTo).diff(moment())}</Typography>
  );
};
