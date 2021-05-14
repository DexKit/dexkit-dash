import React from 'react';
import {TableRow, TableCell, makeStyles, Link} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import {TokenPair} from 'types/app';
import {EXCHANGE, NETWORK} from 'shared/constants/AppEnums';
import {CremaTheme} from 'types/AppContextPropsType';
import {GET_PROTOCOL_PAIR_URL, GET_PROTOCOL_TOKEN_URL} from 'utils/protocol';
import TokenLogo from 'shared/components/TokenLogo';
import {isMobile} from 'web3modal';
import ExchangeLogo from 'shared/components/ExchangeLogo';
interface TableItemProps {
  row: TokenPair;
  exchange: EXCHANGE;
  networkName: NETWORK;
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

const TableItem: React.FC<TableItemProps> = ({row, exchange, networkName}) => {
  const classes = useStyles();

  return (
    <TableRow hover role='checkbox' tabIndex={-1} key={row.address}>
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
      <TableCell align='left' className={classes.tableCell}>
        ${row.closePriceUsd.toFixed(2)}
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
        {' '}
        {row.baseVolume24.toFixed(3)}{' '}
        <Link
          href={GET_PROTOCOL_TOKEN_URL(networkName, row.baseToken, exchange)}>
          {' '}
          {row.baseToken.symbol}{' '}
        </Link>
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
        {' '}
        {row.quoteVolume24.toFixed(3)}{' '}
        <Link
          href={GET_PROTOCOL_TOKEN_URL(networkName, row.quoteToken, exchange)}>
          {' '}
          {row.quoteToken.symbol}{' '}
        </Link>
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
        ${row.volume24InUsd.toFixed(2)}
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
        {row.trades}
      </TableCell>
      {exchange === EXCHANGE.ALL && (
        <TableCell align='left' className={classes.tableCell}>
           <ExchangeLogo exchange={row.exchange}/>
        </TableCell>
      )}
    </TableRow>
  );
};

export default TableItem;
