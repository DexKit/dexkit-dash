import React from 'react';
import {GetTokenTrades_ethereum_dexTrades} from 'services/graphql/bitquery/protocol/__generated__/GetTokenTrades';
import {CremaTheme} from 'types/AppContextPropsType';
import {GET_PROTOCOL_TOKEN_URL} from 'utils/protocol';
import {EXCHANGE, EthereumNetwork} from 'shared/constants/AppEnums';
import {
  Box,
  TableCell,
  TableRow,
  Chip,
  Link,
  Avatar,
  makeStyles,
} from '@material-ui/core';

import {Link as RouterLink} from 'react-router-dom';
import { MintBurn } from 'types/app';

interface Props {
  row: MintBurn;
  networkName: EthereumNetwork;
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
  center: {
    textAlign: 'center',
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

const TableItem: React.FC<Props> = ({row, networkName, exchange}) => {
  const classes = useStyles();

  const getPaymentTypeColor = () => {
    switch (row.type) {
      case 'Remove': {
        return '#F84E4E';
      }
      case 'Add': {
        return '#00b400';
      }
      default: {
        return '#E2A72E';
      }
    }
  };

  const getPaymentStatusColor = () => {
    if (row.variation > 0) {
      return '#00b400';
    } else if (row.variation < 0) {
      return '#F84E4E';
    } else {
      return 'none';
    }
  };

  const timeFn  = new Date((row?.time)||0);

  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      <TableCell component='th' scope='row' className={classes.tableCell}>
        <Box>{timeFn.toLocaleDateString()}</Box>
        <Box>{timeFn.toLocaleTimeString()}</Box>
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        <Chip
          style={{backgroundColor: getPaymentTypeColor(), color: 'white'}}
          label={row.type}
        />
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {row.amount0.toFixed(2)}{' '}
        <Link to={GET_PROTOCOL_TOKEN_URL(networkName, row.baseCurrency?.address, exchange)} component={RouterLink}>
          {row.baseCurrency?.symbol}
        </Link>
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {row.amount1.toFixed(2)}{' '}
        <Link to={GET_PROTOCOL_TOKEN_URL(networkName, row.quoteCurrency?.address, exchange)} component={RouterLink}>
          {row.quoteCurrency?.symbol}
        </Link>
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        <Box
          className={classes.badgeRoot}
          style={{color: getPaymentStatusColor(), backgroundColor: getPaymentStatusColor() + '44'}}>
          {row.variation.toFixed(2)}%
        </Box>
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        <Box className={classes.badgeRoot}>
          {row.reserve0.toFixed(2)}{' '}
          <Link
            to={GET_PROTOCOL_TOKEN_URL(
              networkName,
              row.baseCurrency?.address,
              exchange,
            )}
            component={RouterLink}
            >
            {row.baseCurrency?.symbol}
          </Link>
        </Box>
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        <Box className={classes.badgeRoot}>
          {row.reserve1.toFixed(2)}{' '}
          <Link to={GET_PROTOCOL_TOKEN_URL(networkName, row.quoteCurrency?.address, exchange)} component={RouterLink}>
            {row.quoteCurrency?.symbol}
          </Link>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
