import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import {Box, makeStyles} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';
import {Fonts} from '../../../../../../shared/constants/AppEnums';
import {CremaTheme} from '../../../../../../types/AppContextPropsType';
import { truncateAddress } from 'utils';
import { OrderByPairs } from 'types/app';
import { Link } from 'react-router-dom';


interface TableItemProps {
  row: OrderByPairs;
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
      <TableCell component='th' scope='row' className={classes.tableCell}>{row.sellAmount.toFixed(2)}</TableCell>
      <TableCell align='left' className={classes.tableCell}>
        <Link to={`/protocol-explorer/uniswap/token-explorer/${row.sellToken.address}`}>
          {row.sellToken.symbol}
        </Link>
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>{row.buyAmount.toFixed(2)}</TableCell>
      <TableCell align='left' className={classes.tableCell}>
        <Link to={`/protocol-explorer/uniswap/token-explorer/${row.buyToken.address}`}>
          {row.buyToken.symbol}
        </Link>
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>{row.tradeCount}</TableCell>
      <TableCell align='left' className={classes.tableCell}>{row.started}</TableCell>
      <TableCell align='left' className={classes.tableCell}>{row.daysTraded}</TableCell>
      <TableCell align='left' className={classes.tableCell}>{row.medianPrice.toFixed(2)}</TableCell>
      <TableCell align='left' className={classes.tableCell}>{row.lastPrice.toFixed(2)}</TableCell>
    </TableRow>
  );
};

export default TableItem;
