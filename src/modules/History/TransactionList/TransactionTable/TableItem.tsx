import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import { Chip, Link, makeStyles} from '@material-ui/core';
import {Link as RouterLink} from 'react-router-dom';

import TableRow from '@material-ui/core/TableRow';

import {CremaTheme} from 'types/AppContextPropsType';

import SearchIcon from '@material-ui/icons/Search';
import { useWeb3 } from 'hooks/useWeb3';
import { truncateAddress } from 'utils';
import { ITransactionList } from 'types/app';
import { EthereumNetwork } from 'shared/constants/AppEnums';


interface TableItemProps {
  row: ITransactionList;
  networkName: EthereumNetwork;
}

const TableItem: React.FC<TableItemProps> = ({row, networkName}) => {
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

  const getTypeColor = () => {
    switch (row.type) {
      case 'Send': {
        return '#F84E4E';
      }
      case 'Receive': {
        return '#00b400';
      }
      default: {
        return '#E2A72E';
      }
    }
  };

  return (
    <TableRow key={row.transaction?.hash} className={classes.borderBottomClass}>
      
      <TableCell align='left' className={classes.tableCell}>
        {row.block?.timestamp?.time}
      </TableCell>
      
      <TableCell align='left' className={classes.tableCell}>
        {truncateAddress(row.sender?.address)}
      </TableCell>
      
      <TableCell align='left' className={classes.tableCell}>
        <Chip style={{backgroundColor:getTypeColor(), color: 'white'}} label={row.type} />
      </TableCell>
      
      <TableCell align='left' className={classes.tableCell}>
        {truncateAddress(row.receiver?.address)}
      </TableCell>
      
      <TableCell align='left' className={classes.tableCell}>
        {row.amount?.toFixed(4)} {row.currency?.symbol}
      </TableCell>
      
      <TableCell align='left' className={classes.tableCell}>
        ${row.amountInUsd?.toFixed(4)}
      </TableCell>      
      
      <TableCell align='left' className={classes.tableCell}>
        <Link to={`/${networkName}/history/transaction/view/${row.transaction?.hash}`} component={RouterLink}>
          <SearchIcon />
        </Link>
      </TableCell>

    </TableRow>
  );
};

export default TableItem;
