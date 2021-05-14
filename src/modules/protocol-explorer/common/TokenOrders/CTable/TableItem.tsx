import React from 'react';
import {useWeb3} from 'hooks/useWeb3';
import Box from '@material-ui/core/Box';
import {
  TableRow,
  TableCell,
  makeStyles,
  Chip,
  Link,
  Avatar,
  Tooltip,
} from '@material-ui/core';
import {OrderData} from 'types/app';
import {ETHERSCAN_API_URL} from 'shared/constants/AppConst';
import SearchIcon from '@material-ui/icons/Search';
import {CremaTheme} from 'types/AppContextPropsType';
import {GET_PROTOCOL_PAIR_URL, GET_PROTOCOL_TOKEN_URL} from 'utils/protocol';
import {EthereumNetwork, EXCHANGE, NETWORK} from 'shared/constants/AppEnums';
import TokenLogo from 'shared/components/TokenLogo';
import {useNetwork} from 'hooks/useNetwork';
import { useIntl } from 'react-intl';
import {isMobile} from 'web3modal';
import ExchangeLogo from 'shared/components/ExchangeLogo';

interface TableItemProps {
  row: OrderData;
  exchange: EXCHANGE;
  networkName: NETWORK;
  type: 'pair' | 'token';
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

const TableItem: React.FC<TableItemProps> = ({
  row,
  exchange,
  type,
  networkName,
}) => {
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

  const createdFn = new Date(row.created)
  const netName = useNetwork();
  const {messages} = useIntl();

  return (
    <TableRow hover role='checkbox' tabIndex={-1} key={row.hash}>
      <TableCell component='th' scope='row' className={classes.tableCell}>
        <Box>{createdFn.toLocaleDateString()}</Box>
        <Box>{createdFn.toLocaleTimeString()}</Box>
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
        <Chip
          style={{backgroundColor: getPaymentTypeColor(), color: 'white'}}
          label={row.side === 'SELL' ? 'BUY' : 'SELL'}
        />
      </TableCell>
      {type === 'token' && (
        <TableCell align='left' className={classes.tableCell}>
          <Box display='flex' alignItems='center'>
          {!isMobile() && <TokenLogo
              token0={row.baseToken.address}
              token1={row.quoteToken.address}></TokenLogo>}
            <Link href={GET_PROTOCOL_PAIR_URL(networkName, exchange, row)}>
              {row.baseToken.symbol}/{row.quoteToken.symbol}
            </Link>
          </Box>
        </TableCell>
      )}
      <TableCell align='left' className={classes.tableCell}>
        ${(row.baseAmountUsd / row.baseAmount).toFixed(2)}
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
        {row.baseAmount.toFixed(2)}
        <Link
          href={GET_PROTOCOL_TOKEN_URL(networkName, row.baseToken, exchange)}>
          {' '}
          {row.baseToken.symbol}{' '}
        </Link>
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
        {row.quoteAmount.toFixed(4)}
        <Link
          href={GET_PROTOCOL_TOKEN_URL(networkName, row.quoteToken, exchange)}>
          {' '}
          {row.quoteToken.symbol}
        </Link>
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
        ${row.tradeAmountUsd.toFixed(2)}
      </TableCell>
      {exchange === EXCHANGE.ALL && (
        <TableCell align='left' className={classes.tableCell}>
          <ExchangeLogo exchange={row.exchange}/>
        </TableCell>
      )}
      <TableCell align='left' className={classes.tableCell}>
        <Box display='flex' alignItems='center'>
        <Tooltip title={messages['app.viewTx']} placement='top'>
          <a
            href={`${ETHERSCAN_API_URL(chainId)}/tx/${row.hash}`}
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
          </Tooltip>
          {/*<a
            href={`${ETHERSCAN_API_URL(chainId)}/tx/${row.hash}`}
            target='_blank'>
            <SearchIcon />
          </a>*/}
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
