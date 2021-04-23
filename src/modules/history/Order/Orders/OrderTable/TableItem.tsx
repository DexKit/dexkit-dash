import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import {Box, Chip, makeStyles} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';
import {Fonts} from '../../../../../shared/constants/AppEnums';
import {CremaTheme} from '../../../../../types/AppContextPropsType';
import { truncateAddress } from 'utils';
import { OrderData } from 'types/app';
import { useWeb3 } from 'hooks/useWeb3';
import { ETHERSCAN_API_URL } from '../../../../../shared/constants/AppConst';
import SearchIcon from '@material-ui/icons/Search';

interface TableItemProps {
  row: OrderData;
}

const TableItem: React.FC<TableItemProps> = ({row}) => {
  const useStyles = makeStyles((theme: CremaTheme) => ({
    borderBottomClass: {
      borderBottom: '0 none',
    },
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
  }));
  const classes = useStyles();

  const {chainId} = useWeb3();

  const getPaymentTypeColor = () => {
    switch (row.side) {
      case 'SELL': {
        return '#F84E4E';
      }
      case 'BUY': {
        return '#00b400';
      }
      default: {
        return '#E2A72E';
      }
    }
  };

  return (
    <TableRow key={row.hash} className={classes.borderBottomClass}>
      
      <TableCell align='left' className={classes.tableCell}>{row.exchange}</TableCell>
      
      <TableCell align='left' className={classes.tableCell}>
        <Chip style={ {backgroundColor:getPaymentTypeColor(), color: 'white'}} label={row.side} clickable />
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>{row.baseToken.symbol}/{row.quoteToken.symbol}</TableCell>
      
      <TableCell align='left' className={classes.tableCell}>{row.baseAmount.toFixed(4)} {row.baseToken.symbol}</TableCell>
      
      <TableCell align='left' className={classes.tableCell}>{row.quoteAmount.toFixed(4)} {row.quoteToken.symbol}</TableCell>
      
      <TableCell align='left' className={classes.tableCell}>{row.quotePrice.toFixed(4)}</TableCell>

      <TableCell align='left' className={classes.tableCell}>${row.tradeAmountUsd.toFixed(2)}</TableCell>
      
      <TableCell align='left' className={classes.tableCell}>{row.created}</TableCell>
      
      <TableCell align='left' className={classes.tableCell}>
        <a href={`${ETHERSCAN_API_URL(chainId)}/tx/${row.hash}`} target="_blank">
          <SearchIcon />
        </a>
      </TableCell>

    </TableRow>
  );
};

export default TableItem;
