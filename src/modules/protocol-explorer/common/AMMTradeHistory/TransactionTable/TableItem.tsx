import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import {makeStyles, Chip, Link, Avatar} from '@material-ui/core';
import {OrderData} from 'types/app';

import {ETHERSCAN_API_URL} from 'shared/constants/AppConst';
import {useWeb3} from 'hooks/useWeb3';
import SearchIcon from '@material-ui/icons/Search';
import {CremaTheme} from 'types/AppContextPropsType';
import {GET_PROTOCOL_TOKEN_URL} from 'utils/protocol';
import {NETWORK, EXCHANGE} from 'shared/constants/AppEnums';
import { useNetwork } from 'hooks/useNetwork';

interface Props {
  data: OrderData;
  networkName: NETWORK;
  exchange: EXCHANGE;
}

const useStyles = makeStyles((theme: CremaTheme) => ({
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

const TableItem: React.FC<Props> = ({data, networkName, exchange}) => {
  const classes = useStyles();
  const {chainId} = useWeb3();

  const getPaymentTypeColor = () => {
    switch (data.side) {
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

  const createdFn = data.created.split(' ');
  const netName = useNetwork();

  return (
    <TableRow hover role='checkbox' tabIndex={-1} key={data.hash}>
      <TableCell component='th' scope='row' className={classes.tableCell}>
        <Box>{createdFn[0]}</Box>
        <Box>{createdFn[1]}</Box>
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        <Chip
          style={{backgroundColor: getPaymentTypeColor(), color: 'white'}}
          label={data.side === 'SELL' ? 'BUY' : 'SELL'}
        />
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        ${(data.baseAmountUsd / data.baseAmount).toFixed(2)}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {data.baseAmount.toFixed(4)}{' '}
        <Link
          href={GET_PROTOCOL_TOKEN_URL(networkName, data.baseToken, exchange)}>
          {data.baseToken.symbol}
        </Link>
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {data.quoteAmount.toFixed(4)}{' '}
        <Link
          href={GET_PROTOCOL_TOKEN_URL(networkName, data.quoteToken, exchange)}>
          {data.quoteToken.symbol}
        </Link>
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        ${data.tradeAmountUsd.toFixed(2)}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        <Box display='flex' alignItems='center'>
          <a
            href={`${ETHERSCAN_API_URL(chainId)}/tx/${data.hash}`}
            target='_blank'>
            {netName == NETWORK.ETHEREUM ? (
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
          <a
            href={`${ETHERSCAN_API_URL(chainId)}/tx/${data.hash}`}
            target='_blank'>
            <SearchIcon />
          </a>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
