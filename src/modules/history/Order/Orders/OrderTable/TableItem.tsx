import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import {Box, makeStyles} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';
import {Fonts} from '../../../../../shared/constants/AppEnums';
import {CremaTheme} from '../../../../../types/AppContextPropsType';
import { truncateAddress } from 'utils';
import { OrderData } from 'types/app';


interface TableItemProps {
  row: OrderData;
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
    <TableRow key={row.hash} className={classes.borderBottomClass}>
      {/* <TableCell component='th' scope='row' className={classes.tableCell}>{row.block}</TableCell> */}
      <TableCell align='left' className={classes.tableCell}>
        <a href={row.hash} target="_blank">
          {truncateAddress(row.hash)}
        </a>
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>{row.protocol}</TableCell>
      <TableCell align='left' className={classes.tableCell}>${row.sellAmountUsd.toFixed(6)}</TableCell>
      <TableCell align='left' className={classes.tableCell}>{row.sellToken.symbol}</TableCell>
      <TableCell align='left' className={classes.tableCell}>${row.buyAmountUsd.toFixed(6)}</TableCell>
      <TableCell align='left' className={classes.tableCell}>{row.buyToken.symbol}</TableCell>
      <TableCell align='left' className={classes.tableCell}>{row.exchange}</TableCell>
      <TableCell align='left' className={classes.tableCell}>
        <a href={row.hash} target="_blank">
          {truncateAddress(row.contract)}
        </a>
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>{row.created}</TableCell>
    </TableRow>
  );
};

export default TableItem;
