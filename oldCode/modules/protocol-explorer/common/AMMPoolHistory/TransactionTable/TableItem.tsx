import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import {makeStyles, Chip, Link} from '@material-ui/core';
import {MintBurn} from 'types/app';
import {CremaTheme} from 'types/AppContextPropsType';
import {GET_PROTOCOL_TOKEN_URL} from 'utils/protocol';
import {EXCHANGE, NETWORK} from 'shared/constants/AppEnums';

interface Props {
  data: MintBurn;
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

const TableItem: React.FC<Props> = ({data, networkName, exchange}) => {
  const classes = useStyles();
  const getPaymentTypeColor = () => {
    switch (data.type) {
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
    if (data.variation > 0) {
      return '#00b400';
    } else if (data.variation < 0) {
      return '#F84E4E';
    } else {
      return 'none';
    }
  };

  const timeFn = data.time.split(' ');

  return (
    <TableRow hover role='checkbox' tabIndex={-1} key={data.hash}>
      <TableCell component='th' scope='row' className={classes.tableCell}>
        <Box>{timeFn[0]}</Box>
        <Box>{timeFn[1]}</Box>
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        <Chip
          style={{backgroundColor: getPaymentTypeColor(), color: 'white'}}
          label={data.type}
          clickable
        />
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {data.amount0.toFixed(2)}{' '}
        <Link
          href={GET_PROTOCOL_TOKEN_URL(networkName, data.baseToken, exchange)}>
          {data.baseToken.symbol}
        </Link>
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {data.amount1.toFixed(2)}{' '}
        <Link
          href={GET_PROTOCOL_TOKEN_URL(networkName, data.quoteToken, exchange)}>
          {data.quoteToken.symbol}
        </Link>
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        <Box
          className={classes.badgeRoot}
          style={{
            color: getPaymentStatusColor(),
            backgroundColor: getPaymentStatusColor() + '44',
          }}>
          {data.variation.toFixed(2)}%
        </Box>
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        <Box className={classes.badgeRoot}>
          {data.reserve0.toFixed(2)}{' '}
          <Link
            href={GET_PROTOCOL_TOKEN_URL(
              networkName,
              data.baseToken,
              exchange,
            )}>
            {data.baseToken.symbol}
          </Link>
        </Box>
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        <Box className={classes.badgeRoot}>
          {data.reserve1.toFixed(2)}{' '}
          <Link
            href={GET_PROTOCOL_TOKEN_URL(
              networkName,
              data.quoteToken,
              exchange,
            )}>
            {data.quoteToken.symbol}
          </Link>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
