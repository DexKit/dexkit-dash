import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import {Avatar, Chip, makeStyles, Tooltip} from '@material-ui/core';

import TableRow from '@material-ui/core/TableRow';

import {CremaTheme} from 'types/AppContextPropsType';

import {truncateAddress} from 'utils';
import {ITransactionList} from 'types/app';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {useIntl} from 'react-intl';
import {ETHERSCAN_API_URL_FROM_NETWORK} from 'shared/constants/AppConst';

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

  const {messages} = useIntl();

  return (
    <TableRow key={row.transaction?.hash} className={classes.borderBottomClass}>
      <TableCell align='left' className={classes.tableCell}>
        {row.block?.timestamp?.time}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {truncateAddress(row.sender?.address)}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        <Chip
          style={{backgroundColor: getTypeColor(), color: 'white'}}
          label={row.type}
        />
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
        {/*<Link to={`/${networkName}/history/transaction/view/${row.transaction?.hash}`} component={RouterLink}>
          <SearchIcon />
  </Link>*/}
        <Tooltip title={messages['app.viewTx']} placement='top'>
          <a
            href={`${ETHERSCAN_API_URL_FROM_NETWORK(networkName)}/tx/${
              row.transaction?.hash
            }`}
            target='_blank'
            rel='noreferrer'>
            {networkName == EthereumNetwork.ethereum ? (
              <Avatar
                style={{
                  color: '#3F51B5',
                  backgroundColor: 'white',
                  width: '20px',
                  height: '20px',
                  marginRight: '5px',
                  marginBottom: '5px',
                }}
                src='/images/etherescan.png'></Avatar>
            ) : (
              <Avatar
                style={{
                  color: '#3F51B5',
                  backgroundColor: 'white',
                  width: '20px',
                  height: '20px',
                  marginRight: '5px',
                  marginBottom: '5px',
                }}
                src='/images/bscscan-logo-circle.png'></Avatar>
            )}
          </a>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
