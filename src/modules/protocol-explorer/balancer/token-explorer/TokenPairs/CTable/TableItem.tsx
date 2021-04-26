import React from 'react';
import { useWeb3 } from 'hooks/useWeb3';
import {TableRow, TableCell, makeStyles} from '@material-ui/core';
import {CremaTheme} from '../../../../../../types/AppContextPropsType';
import { TokenPair } from 'types/app';
import { ETHERSCAN_API_URL } from 'shared/constants/AppConst';
import SearchIcon from '@material-ui/icons/Search';
import { Link } from 'react-router-dom';

interface TableItemProps {
  row: TokenPair;
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
    <TableRow key={row.address}>
      <TableCell align='left' className={classes.tableCell}><Link to={`/protocol-explorer/0x-protocol/pair-explorer/${row.baseToken.address}-${row.quoteToken.address}`}>{row.baseToken.symbol}/{row.quoteToken.symbol}</Link></TableCell>
      <TableCell align='left' className={classes.tableCell}>${(row.priceUsd).toFixed(2)}</TableCell>
      <TableCell align='left' className={classes.tableCell}> {row.baseVolume24.toFixed(3)} {row.baseToken.symbol}</TableCell>
      <TableCell align='left' className={classes.tableCell}> {row.quoteVolume24.toFixed(3)} {row.quoteToken.symbol}</TableCell>
      <TableCell align='left' className={classes.tableCell}>${(row.volume24InUsd).toFixed(2)}</TableCell>
      <TableCell align='left' className={classes.tableCell}>
        {row.trades}
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
