import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import {Chip, Link, makeStyles} from '@material-ui/core';

import TableRow from '@material-ui/core/TableRow';

import {CremaTheme} from 'types/AppContextPropsType';

import SearchIcon from '@material-ui/icons/Search';
import {useWeb3} from 'hooks/useWeb3';
import {GET_EXCHANGE_FROM_URL, GET_PROTOCOL_TOKEN_URL, truncateAddress} from 'utils';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import { GET_EXCHANGE_NAME } from 'shared/constants/Bitquery';

interface TableItemProps {
  row: any;
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
        // [theme.breakpoints.up('xl')]: {
        //   paddingLeft: 4,
        // },
        paddingLeft: 20,
      },
      '&:last-child': {
        // [theme.breakpoints.up('xl')]: {
        //   paddingRight: 4,
        // },
        paddingRight: 20,
      },
      // [theme.breakpoints.up('xl')]: {
      //   fontSize: 18,
      //   padding: 16,
      // },
    },
  }));

  const classes = useStyles();

  return (
    <TableRow key={row.transaction?.hash} className={classes.borderBottomClass}>
      <TableCell align='left' className={classes.tableCell}>
        {Number(row.order.makerAmountFn).toFixed(2)}
        {' '}{row.order?.makerTokenFn?.symbol}{' '}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {Number(row.order.takerAmountFn).toFixed(2)}
        {' '}{row.order?.takerTokenFn?.symbol}{' '}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {Number(row.metaData.remainingFillableTakerAmountFn).toFixed(2)}
        {' '}{row.order?.takerTokenFn?.symbol}{' '}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {new Date(row.order.expiry * 1000).toLocaleDateString()}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {/* <Link href={`/${networkName}/history/order/view/${row.metaData.orderHash}`}>
          <SearchIcon />
        </Link> */}
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
