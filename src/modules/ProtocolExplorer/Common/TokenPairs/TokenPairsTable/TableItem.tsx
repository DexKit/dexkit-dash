import React from 'react';

import {CremaTheme} from 'types/AppContextPropsType';
import {EXCHANGE, EthereumNetwork} from 'shared/constants/AppEnums';
import TokenLogo from 'shared/components/TokenLogo';
import {TableRow, TableCell, makeStyles, Link, Box} from '@material-ui/core';
import {Link as RouterLink} from 'react-router-dom';
import {isMobile} from 'web3modal';
import { GET_PROTOCOL_PAIR_URL, GET_PROTOCOL_TOKEN_URL, GET_CORRECT_ADDRESS_FROM_NETWORK } from 'utils';
import ExchangeLogo from 'shared/components/ExchangeLogo';
import { useUSDFormatter } from 'hooks/utils/useUSDFormatter';

interface TableItemProps {
  row: any; //GetTokenPairs_ethereum_dexTrades;
  exchange: EXCHANGE;
  networkName: EthereumNetwork;
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
  const {usdFormatter} = useUSDFormatter();
  const closePriceUsd = usdFormatter.format(row?.closePriceUsd || 0);
  const volumeUsd = usdFormatter.format(row?.volume24InUsd || 0)
  // const dataProtocolPair = {
  //   contract: row.smartContract?.address,
  //   baseToken: row.baseCurrency,
  //   quoteToken: row.quoteCurrency,
  // };

  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      <TableCell align='left' className={classes.tableCell}>
        <Box display='flex' alignItems='center'>
          {!isMobile() && <TokenLogo token0={row.baseCurrency?.address||''} token1={row.quoteCurrency?.address||''}></TokenLogo>}
          <Link to={GET_PROTOCOL_PAIR_URL(networkName, exchange, row.smartContract?.address.address, GET_CORRECT_ADDRESS_FROM_NETWORK(networkName, row.baseCurrency), GET_CORRECT_ADDRESS_FROM_NETWORK(networkName, row.quoteCurrency))} component={RouterLink}>
            {row.baseCurrency?.symbol}/{row.quoteCurrency?.symbol}
          </Link>
        </Box>
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
          {closePriceUsd}
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
        {' '}{row.baseVolume24.toFixed(3)}{' '}
        <Link to={GET_PROTOCOL_TOKEN_URL(networkName, GET_CORRECT_ADDRESS_FROM_NETWORK(networkName, row.baseCurrency), exchange)} component={RouterLink}>
          {' '}{row.baseCurrency.symbol}{' '}
        </Link>
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
        {' '}{row.quoteVolume24.toFixed(3)}{' '}
        <Link to={GET_PROTOCOL_TOKEN_URL(networkName, GET_CORRECT_ADDRESS_FROM_NETWORK(networkName, row.quoteCurrency), exchange)} component={RouterLink}>
          {' '}{row.quoteCurrency.symbol}{' '}
        </Link>
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
        {volumeUsd}
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
        {row.trades}
      </TableCell>
      {exchange === EXCHANGE.ALL && (
        <TableCell align='left' className={classes.tableCell}>
           <ExchangeLogo exchange={row.exchange?.fullName}/>
        </TableCell>
      )}
    </TableRow>
  );
};

export default TableItem;
