import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import {makeStyles} from '@material-ui/core/styles';
import {Fonts} from '../../../../../../shared/constants/AppEnums';

const useStyles = makeStyles(() => ({
  tableRowRoot: {
    '& th': {
      fontSize: 13,
      padding: 8,
      fontWeight: Fonts.BOLD,
      '&:first-child': {
        paddingLeft: 20,
      },
      '&:last-child': {
        paddingRight: 20,
      },
    },
  },
}));

const TableHeading = () => {
  const classes = useStyles();
  return (
    <TableRow className={classes.tableRowRoot}>
      <TableCell>Pair</TableCell>
      <TableCell  align="center">Liquidity</TableCell>
      <TableCell style={{marginRight: 50}} align="center">Volume</TableCell>
    </TableRow>
  );
};

export default TableHeading;
