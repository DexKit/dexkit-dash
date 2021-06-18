import {toTokenUnitAmount} from '@0x/utils';
import {
  TableRow,
  TableCell,
  Avatar,
  Grid,
  Tooltip,
  Typography,
  makeStyles,
} from '@material-ui/core';
import React from 'react';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  tokenImageSmall: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

interface Props {
  order: any;
}

export default (props: Props) => {
  const {order} = props;
  const classes = useStyles();

  return (
    <TableRow>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell>{moment(order.created_date).fromNow()}</TableCell>
    </TableRow>
  );
};
