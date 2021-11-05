import React, {useContext, useMemo} from 'react';
import TableCell from '@material-ui/core/TableCell';
import {Chip, makeStyles} from '@material-ui/core';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import CollapsibleTableRow from 'shared/components/CollapsibleTableRow';
import TableRow from '@material-ui/core/TableRow';
import IntlMessages from '@crema/utility/IntlMessages';
import AppContextPropsType, {CremaTheme} from 'types/AppContextPropsType';
import {GetTradeHistoryList_ethereum_dexTrades} from 'services/graphql/bitquery/history/__generated__/GetTradeHistoryList';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import ExchangeLogo from 'shared/components/ExchangeLogo';
import {AppContext} from '@crema';

import {ViewTx} from 'shared/components/ViewTx';

interface TableItemProps {
  row: GetTradeHistoryList_ethereum_dexTrades;
  networkName: EthereumNetwork;
}

const useStyles = makeStyles((theme: CremaTheme) => ({
  borderBottomClass: {
    borderBottom: '0 none',
  },
  tableCell: {
    fontSize: 16,
    borderBottom: 0,
    padding: '12px 8px',
    '&:first-child': {
      paddingLeft: 20,
    },
    '&:last-child': {
      paddingRight: 20,
    },
  },
}));

const TableItem: React.FC<TableItemProps> = ({row, networkName}) => {
  const classes = useStyles();
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  const paymentTypeColor = useMemo(() => {
    switch (row.side) {
      case 'SELL': {
        return '#F84E4E';
      }
      case 'BUY': {
        return '#00b400';
      }
      default: {
        return '#E2A72E';
      }
    }
  }, [row.side]);

  const {locale} = useContext<AppContextPropsType>(AppContext);
  const timestamp = row.block?.timestamp?.time
    ? new Date(row.block?.timestamp?.time).toLocaleString()
    : row.block?.timestamp?.time;

  const formatter = new Intl.NumberFormat(locale.locale, {
    style: 'currency',
    currency: 'USD',
  });
  const priceUSD = row?.baseAmount
    ? formatter.format((row?.tradeAmountIsUsd || 0) / row?.baseAmount)
    : '-';

  /* eslint-disable */
  const ViewTxComponent = React.useMemo(
    () => () =>
      <ViewTx networkName={networkName} hash={row.transaction?.hash || ''} />,
    [networkName, row.transaction?.hash],
  );

  if (isMobile) {
    const summaryTitle = (
      <Chip
        style={{backgroundColor: paymentTypeColor, color: 'white'}}
        label={row.side}
      />
    );
    const summaryValue = `${row.baseAmount?.toFixed(4)} ${
      row.baseCurrency?.symbol
    } for ${row.quoteAmount?.toFixed(4)} ${row.quoteCurrency?.symbol}`;
    const data = [
      {
        id: 'pair',
        title: <IntlMessages id='app.pair' />,
        value: `{row.baseCurrency?.symbol}/{row.quoteCurrency?.symbol}`,
      },
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
            label={row.side}
          />
        ),
      },
      {
        id: 'baseAmount',
        title: <IntlMessages id='app.baseAmount' />,
        value: `${row.baseAmount?.toFixed(4)} ${row.baseCurrency?.symbol}`,
      },
      {
        id: 'quoteAmount',
        title: <IntlMessages id='app.quoteAmount' />,
        value: `${row.quoteAmount?.toFixed(4)} ${row.quoteCurrency?.symbol}`,
      },
      {
        id: 'price',
        title: <IntlMessages id='app.price' />,
        value: priceUSD,
      },
      {
        id: 'tradeAmount',
        title: <IntlMessages id='app.tradeAmount' />,
        value: formatter.format(row.tradeAmountIsUsd || 0),
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
    <TableRow key={row.transaction?.hash} className={classes.borderBottomClass}>
      <TableCell align='center' className={classes.tableCell}>
        {row.exchange && <ExchangeLogo exchange={row.exchange.fullName} />}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        <Chip
          style={{backgroundColor: paymentTypeColor, color: 'white'}}
          label={row.side}
        />
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {row.baseCurrency?.symbol}/{row.quoteCurrency?.symbol}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {row.baseAmount?.toFixed(4)} {row.baseCurrency?.symbol}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {row.quoteAmount?.toFixed(4)} {row.quoteCurrency?.symbol}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {priceUSD}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {formatter.format(row.tradeAmountIsUsd || 0)}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {timestamp}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        <ViewTxComponent />
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
