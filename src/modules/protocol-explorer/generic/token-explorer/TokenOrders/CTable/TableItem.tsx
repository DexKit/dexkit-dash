import React from 'react';
import { useWeb3 } from 'hooks/useWeb3';
import {TableRow, TableCell, makeStyles} from '@material-ui/core';
import {CremaTheme} from '../../../../../../types/AppContextPropsType';
import { OrderData } from 'types/app';
import { ETHERSCAN_API_URL } from 'shared/constants/AppConst';
import SearchIcon from '@material-ui/icons/Search';


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
  const {chainId} = useWeb3();

  return (
    <TableRow key={row.hash}>
      <TableCell scope='row' className={classes.tableCell}>{row.created}</TableCell>
      <TableCell align='left' className={classes.tableCell}>{row.baseToken.symbol}/{row.quoteToken.symbol}</TableCell>
      <TableCell align='left' className={classes.tableCell}>${row.baseAmountUsd.toFixed(2)} ({row.baseToken.symbol})</TableCell>
      <TableCell align='left' className={classes.tableCell}>${row.quoteAmountUsd.toFixed(2)} ({row.quoteToken.symbol})</TableCell>
      <TableCell align='left' className={classes.tableCell}>${row.tradeAmountUsd.toFixed(2)}</TableCell>
      <TableCell align='left' className={classes.tableCell}>
        <a href={`${ETHERSCAN_API_URL(chainId)}/tx/${row.hash}`} target="_blank">
          <SearchIcon />
        </a>
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
