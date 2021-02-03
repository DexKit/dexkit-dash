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
  tableCellRoot: {
    borderBottom: '0 none',
    fontSize: 16,
    padding: 8,
    fontFamily: Fonts.BOLD, 
  },
}));

const TableHeading = () => {
  const classes = useStyles();
  return (
    <TableRow className={classes.tableRowRoot}>
      <TableCell className={classes.tableCellRoot} align='left'>Pair</TableCell>
      <TableCell className={classes.tableCellRoot}  align="left">Liquidity</TableCell>
      <TableCell className={classes.tableCellRoot} align='left'  style={{marginRight: 50}} >Volume</TableCell>
    </TableRow>
  );
};

export default TableHeading;
