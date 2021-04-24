import React from 'react';
import { useWeb3 } from 'hooks/useWeb3';
import {TableRow, TableCell, makeStyles, Chip} from '@material-ui/core';
import {CremaTheme} from '../../../../../../types/AppContextPropsType';
import { OrderData } from 'types/app';
import { ETHERSCAN_API_URL } from 'shared/constants/AppConst';
import SearchIcon from '@material-ui/icons/Search';
import { Link } from 'react-router-dom';


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
  const getPaymentTypeColor = () => {
    switch (row.side) {
      case 'BUY': {
        return '#F84E4E';
      }
      case 'SELL': {
        return '#00b400';
      }
      default: {
        return '#E2A72E';
      }
    }
  };


  return (
    <TableRow key={row.hash}>
      <TableCell scope='row' className={classes.tableCell}>{row.created}</TableCell>
      <TableCell align='left' className={classes.tableCell}>
        <Chip style={ {backgroundColor:getPaymentTypeColor(), color: 'white'}} label={row.side === 'SELL' ? 'BUY' : 'SELL'} clickable />
      </TableCell>
      <TableCell align='left' className={classes.tableCell}><Link to={`/protocol-explorer/uniswap/pair-explorer/${row.contract}`}>{row.baseToken.symbol}/{row.quoteToken.symbol}</Link></TableCell>
      <TableCell align='left' className={classes.tableCell}>${(row.baseAmountUsd/row.baseAmount).toFixed(2)}</TableCell>
      <TableCell align='left' className={classes.tableCell}>{(row.baseAmount).toFixed(2)} {row.baseToken.symbol}</TableCell>
      <TableCell align='left' className={classes.tableCell}>{(row.quoteAmount).toFixed(4)} {row.quoteToken.symbol}</TableCell>
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
