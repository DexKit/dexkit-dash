import React, {useMemo} from 'react';

import {useIntl} from 'react-intl';

import {GetTokenTrades_ethereum_dexTrades} from 'services/graphql/bitquery/protocol/__generated__/GetTokenTrades';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import {makeStyles} from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import {EthereumNetwork, EXCHANGE} from 'shared/constants/AppEnums';
import TokenLogo from 'shared/components/TokenLogo';

import ExchangeLogo from 'shared/components/ExchangeLogo';

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

const useStyles = makeStyles((theme) => ({
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
  const {messages} = useIntl();
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  const timestamp = row.block?.timestamp?.time
    ? new Date(row.block?.timestamp?.time).toLocaleString()
    : row.block?.timestamp?.time;

  const paymentTypeColor = useMemo(() => {
    switch (row.side) {
      case messages['app.buy']: {
        return '#F84E4E';
      }
      case messages['app.sell']: {
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
      {row.quoteAmount?.toFixed(4)} {row.quoteCurrency?.symbol}
    </>
  );

  const baseAmountRow = (
    <>
      {row.baseAmount?.toFixed(4)} {row.baseCurrency?.symbol}{' '}
    </>
  );

  if (isMobile) {
    const summaryTitle = (
      <Chip
        style={{backgroundColor: paymentTypeColor, color: 'white'}}
        label={
          row.side === messages['app.sell']
            ? messages['app.buy']
            : messages['app.sell']
        }
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
            label={
              row.side === messages['app.sell']
                ? messages['app.buy']
                : messages['app.sell']
            }
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
          label={
            row.side === messages['app.sell']
              ? messages['app.buy']
              : messages['app.sell']
          }
        />
      </TableCell>
      {type === 'token' && (
        <TableCell align='left' className={classes.tableCell}>
          <Box display='flex' alignItems='center'>
            {!isMobile && (
              <TokenLogo
                token0={row.baseCurrency?.address || ''}
                token1={row.quoteCurrency?.address || ''}
                networkName={networkName}
              />
            )}
            {row.baseCurrency?.symbol}/{row.quoteCurrency?.symbol}
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
