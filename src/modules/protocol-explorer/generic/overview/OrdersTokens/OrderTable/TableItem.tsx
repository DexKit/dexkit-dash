import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import {makeStyles} from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import {Fonts} from '../../../../../../shared/constants/AppEnums';
import {CremaTheme} from '../../../../../../types/AppContextPropsType';
import { OrderByToken } from 'types/app';
import { Link } from 'react-router-dom';


interface TableItemProps {
  row: OrderByToken;
}

const TableItem: React.FC<TableItemProps> = ({row}) => {
  const useStyles = makeStyles((theme: CremaTheme) => ({
    borderBottomClass: {
      borderBottom: '0 none',
    },
    tableCell: {
      borderBottom: '0 none',
      fontSize: 14,
      fontFamily: Fonts.MEDIUM,
      padding: 8,
      '&:first-child': {
        [theme.breakpoints.up('xl')]: {
          paddingLeft: 4,
        },
      },
      '&:last-child': {
        [theme.breakpoints.up('xl')]: {
          paddingRight: 4,
        },
      },
      [theme.breakpoints.up('xl')]: {
        fontSize: 18,
        padding: 16,
      },
    }
  }));
  const classes = useStyles();
  return (
    <TableRow className={classes.borderBottomClass}>
      <TableCell align='left' className={classes.tableCell}>
        <Link to={`/protocol-explorer/uniswap/token-explorer/${row.token.address}`}>
          {row.token.symbol}
        </Link>
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>{row.tradeCount}</TableCell>
      <TableCell align='left' className={classes.tableCell}>{row.amountUsd.toFixed(2)}</TableCell>
      <TableCell align='left' className={classes.tableCell}>{row.started}</TableCell>
      <TableCell align='left' className={classes.tableCell}>{row.daysTraded}</TableCell>
    </TableRow>
  );
};

export default TableItem;
