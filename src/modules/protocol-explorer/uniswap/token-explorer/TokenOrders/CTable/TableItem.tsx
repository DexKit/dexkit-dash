import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import {makeStyles} from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import {CremaTheme} from '../../../../../../types/AppContextPropsType';
import { truncateAddress } from 'utils';
import { OrderData } from 'types/app';


interface TableItemProps {
  row: OrderData;
}

const useStyles = makeStyles((theme: CremaTheme) => ({
  tableCell: {
    fontSize: 16,
    padding: '12px 8px',
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
  },
  anchar: {
    color: theme.palette.primary.main,
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    display: 'inline-block',
  },
  badgeRoot: {
    padding: '3px 10px',
    borderRadius: 4,
    display: 'inline-block',
  },
}));

const TableItem: React.FC<TableItemProps> = ({row}) => {
  const classes = useStyles();

  return (
    <TableRow key={row.hash}>
      <TableCell scope='row' className={classes.tableCell}>{row.created}</TableCell>
      <TableCell align='left' className={classes.tableCell}>{row.block}</TableCell>
      <TableCell align='left' className={classes.tableCell}>$</TableCell>
      <TableCell align='left' className={classes.tableCell}></TableCell>
      <TableCell align='left' className={classes.tableCell}>$</TableCell>
      <TableCell align='left' className={classes.tableCell}></TableCell>
      <TableCell align='left' className={classes.tableCell}>{row.protocol}</TableCell>
      <TableCell align='left' className={classes.tableCell}>{row.exchange}</TableCell>
      <TableCell align='left' className={classes.tableCell}>
        <a href={`https://etherscan.io/address/${row.contract}`} target="_blank">
          {truncateAddress(row.contract)}
        </a>
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
        <a href={`https://etherscan.io/tx/${row.hash}`} target="_blank">
          {truncateAddress(row.hash)}
        </a>
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
