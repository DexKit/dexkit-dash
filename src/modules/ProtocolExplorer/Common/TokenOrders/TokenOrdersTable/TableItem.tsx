import React, {useMemo} from 'react';
import {GetTokenTrades_ethereum_dexTrades} from 'services/graphql/bitquery/protocol/__generated__/GetTokenTrades';
import Box from '@material-ui/core/Box';
import {
  TableRow,
  TableCell,
  makeStyles,
  Chip,
  Link,
  useMediaQuery,
} from '@material-ui/core';
import {Link as RouterLink} from 'react-router-dom';
// import {OrderData} from 'types/app';

import {CremaTheme} from 'types/AppContextPropsType';
import {GET_PROTOCOL_PAIR_URL, GET_PROTOCOL_TOKEN_URL} from 'utils/protocol';
import {EthereumNetwork, EXCHANGE} from 'shared/constants/AppEnums';
import TokenLogo from 'shared/components/TokenLogo';
import {GET_CORRECT_ADDRESS_FROM_NETWORK} from 'utils';
import ExchangeLogo from 'shared/components/ExchangeLogo';
import {useIntl} from 'react-intl';
import {useUSDFormatter} from 'hooks/utils/useUSDFormatter';
import IntlMessages from '@crema/utility/IntlMessages';
import CollapsibleTableRow from 'shared/components/CollapsibleTableRow';
import {ViewTx} from 'shared/components/ViewTx';

interface TableItemProps {
  row: GetTokenTrades_ethereum_dexTrades;
  exchange: EXCHANGE;
  networkName: EthereumNetwork;
  type: 'pair' | 'token';
}

const useStyles = makeStyles((theme: CremaTheme) => ({
  tableCell: {
    fontSize: 16,
    padding: '12px 8px',
    '&:first-child': {
      paddingLeft: 20,
    },
    '&:last-child': {
      paddingRight: 20,
    },
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
  borderBottomClass: {
    borderBottom: '0 none',
  },
}));

const TableItem: React.FC<TableItemProps> = ({
  row,
  exchange,
  type,
  networkName,
}) => {
  const classes = useStyles();
  const {usdFormatter} = useUSDFormatter();
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  const timestamp = row.block?.timestamp?.time
    ? new Date(row.block?.timestamp?.time).toLocaleString()
    : row.block?.timestamp?.time;

  const paymentTypeColor = useMemo(() => {
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
  }, [row.side]);

  const ViewTxComponent = React.useMemo(
    () => () =>
      <ViewTx networkName={networkName} hash={row.transaction?.hash || ''} />,
    [networkName, row.transaction?.hash],
  );

  const createdFn = new Date(row.block?.timestamp?.time || 0);
  const priceUsd = usdFormatter.format(
    (row.tradeAmountIsUsd || 1) / (row.baseAmount || 1),
  );
  const tradeAmountUsd = usdFormatter.format(row.tradeAmountIsUsd || 0);
  const quoteAmountRow = (
    <>
      {row.quoteAmount?.toFixed(4)}
      <Link
        to={GET_PROTOCOL_TOKEN_URL(
          networkName,
          GET_CORRECT_ADDRESS_FROM_NETWORK(networkName, row.quoteCurrency),
          exchange,
        )}
        component={RouterLink}>
        {' '}
        {row.quoteCurrency?.symbol}
      </Link>
    </>
  );

  const baseAmountRow = (
    <>
       {row.baseAmount?.toFixed(4)}
        <Link
          to={GET_PROTOCOL_TOKEN_URL(
            networkName,
            GET_CORRECT_ADDRESS_FROM_NETWORK(networkName, row.baseCurrency),
            exchange,
          )}
          component={RouterLink}>
          {' '}
          {row.baseCurrency?.symbol}{' '}
        </Link>
    </>
  );

  if (isMobile) {
    const summaryTitle = (
      <Chip
        style={{backgroundColor: paymentTypeColor, color: 'white'}}
        label={row.side === 'SELL' ? 'BUY' : 'SELL'}
      />
    );
    const summaryValue = `${row.baseAmount?.toFixed(2)} ${
      row.baseCurrency?.symbol
    } for ${row.quoteAmount?.toFixed(2)} ${row.quoteCurrency?.symbol}`;
    const data = [
      {
        id: 'exchange',
        title: <IntlMessages id='app.exchange' />,
        value: row.exchange ? (
          <ExchangeLogo exchange={row.exchange.fullName} />
        ) : (
          ''
        ),
      },
      {
        id: 'side',
        title: <IntlMessages id='app.side' />,
        value: (
          <Chip
            style={{backgroundColor: paymentTypeColor, color: 'white'}}
            label={row.side === 'SELL' ? 'BUY' : 'SELL'}
          />
        ),
      },
      {
        id: 'baseAmount',
        title: <IntlMessages id='app.baseAmount' />,
        value: baseAmountRow,
      },
      {
        id: 'quoteAmount',
        title: <IntlMessages id='app.quoteAmount' />,
        value: quoteAmountRow,
      },
      {
        id: 'price',
        title: <IntlMessages id='app.price' />,
        value: priceUsd,
      },
      {
        id: 'tradeAmount',
        title: <IntlMessages id='app.tradeAmount' />,
        value: usdFormatter.format(row.tradeAmountIsUsd || 0),
      },
      {
        id: 'created',
        title: <IntlMessages id='app.created' />,
        value: timestamp,
      },
      {
        id: 'viewTx',
        title: '',
        value: <ViewTxComponent />,
      },
    ];

    return (
      <TableRow
        key={row.transaction?.hash}
        className={classes.borderBottomClass}>
        <CollapsibleTableRow
          summaryValue={summaryValue}
          summaryTitle={summaryTitle}
          data={data}
        />
      </TableRow>
    );
  }

  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      <TableCell component='th' scope='row' className={classes.tableCell}>
        <Box>{createdFn.toLocaleDateString()}</Box>
        <Box>{createdFn.toLocaleTimeString()}</Box>
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
        <Chip
          style={{backgroundColor: paymentTypeColor, color: 'white'}}
          label={row.side === 'SELL' ? 'BUY' : 'SELL'}
        />
      </TableCell>
      {type === 'token' && (
        <TableCell align='left' className={classes.tableCell}>
          <Box display='flex' alignItems='center'>
            {!isMobile && (
              <TokenLogo
                token0={row.baseCurrency?.address || ''}
                token1={row.quoteCurrency?.address || ''}></TokenLogo>
            )}
            <Link
              to={GET_PROTOCOL_PAIR_URL(
                networkName,
                exchange,
                row.smartContract?.address.address,
                GET_CORRECT_ADDRESS_FROM_NETWORK(networkName, row.baseCurrency),
                GET_CORRECT_ADDRESS_FROM_NETWORK(
                  networkName,
                  row.quoteCurrency,
                ),
              )}
              component={RouterLink}>
              {row.baseCurrency?.symbol}/{row.quoteCurrency?.symbol}
            </Link>
          </Box>
        </TableCell>
      )}
      <TableCell align='left' className={classes.tableCell}>
        {priceUsd}
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
       {baseAmountRow}
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
       {quoteAmountRow}
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
        {tradeAmountUsd}
      </TableCell>
      {exchange === EXCHANGE.ALL && (
        <TableCell align='left' className={classes.tableCell}>
          <ExchangeLogo exchange={row.exchange?.fullName || ''} />
        </TableCell>
      )}
      <TableCell align='left' className={classes.tableCell}>
        <ViewTxComponent />
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
