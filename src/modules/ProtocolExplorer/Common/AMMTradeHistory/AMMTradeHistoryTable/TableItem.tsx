import React, {useMemo} from 'react';

import {useIntl} from 'react-intl';
import {CremaTheme} from 'types/AppContextPropsType';
import {
  Box,
  TableCell,
  TableRow,
  Chip,
  makeStyles,
  useMediaQuery,
} from '@material-ui/core';
import {GetContractOrders_ethereum_dexTrades} from 'services/graphql/bitquery/protocol/__generated__/GetContractOrders';
import {useUSDFormatter} from 'hooks/utils/useUSDFormatter';
import IntlMessages from '@crema/utility/IntlMessages';
import {EthereumNetwork, EXCHANGE} from 'shared/constants/AppEnums';
import CollapsibleTableRow from 'shared/components/CollapsibleTableRow';
import {ViewTx} from 'shared/components/ViewTx';

interface Props {
  row: GetContractOrders_ethereum_dexTrades;
  networkName: EthereumNetwork;
  exchange: EXCHANGE;
}

const useStyles = makeStyles((theme) => ({
  borderBottomClass: {
    borderBottom: '0 none',
  },
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
}));

const TableItem: React.FC<Props> = ({row, networkName, exchange}) => {
  const classes = useStyles();
  const {messages} = useIntl();
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  const {usdFormatter} = useUSDFormatter();
  const tradeAmountUsd = usdFormatter.format(row.tradeAmountIsUsd || 0);
  const priceUsd = usdFormatter.format(
    (row.baseAmountInUsd || 1) / (row.baseAmount || 1) || 0,
  );

  /* eslint-disable */
  const ViewTxComponent = React.useMemo(
    () => () =>
      <ViewTx networkName={networkName} hash={row.transaction?.hash || ''} />,
    [networkName, row.transaction?.hash],
  );
  const timestamp = row.block?.timestamp?.time
    ? new Date(row.block?.timestamp?.time).toLocaleString()
    : row.block?.timestamp?.time;

  const quoteAmountRow = (
    <>
      {row.quoteAmount?.toFixed(4)} {row.quoteCurrency?.symbol}
    </>
  );

  const baseAmountRow = (
    <>
      {row.baseAmount?.toFixed(4)} {row.baseCurrency?.symbol}
    </>
  );

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

  const createdFn = new Date(row.date?.date || 0);
  if (isMobile) {
    const summaryTitle = (
      <Chip
        style={{backgroundColor: paymentTypeColor, color: 'white'}}
        label={
          row.side === 'SELL'
            ? messages['app.protocolExplorer.buy']
            : messages['app.protocolExplorer.sell']
        }
      />
    );
    const summaryValue = `${row.baseAmount?.toFixed(2)} ${
      row.baseCurrency?.symbol
    } for ${row.quoteAmount?.toFixed(2)} ${row.quoteCurrency?.symbol}`;
    const data = [
      {
        id: 'side',
        title: <IntlMessages id='app.protocolExplorer.side' />,
        value: (
          <Chip
            style={{backgroundColor: paymentTypeColor, color: 'white'}}
            label={
              row.side === 'SELL'
                ? messages['app.protocolExplorer.buy']
                : messages['app.protocolExplorer.sell']
            }
          />
        ),
      },
      {
        id: 'baseAmount',
        title: <IntlMessages id='app.protocolExplorer.baseAmount' />,
        value: baseAmountRow,
      },
      {
        id: 'quoteAmount',
        title: <IntlMessages id='app.protocolExplorer.quoteAmount' />,
        value: quoteAmountRow,
      },
      {
        id: 'price',
        title: <IntlMessages id='app.protocolExplorer.price' />,
        value: priceUsd,
      },
      {
        id: 'tradeAmount',
        title: <IntlMessages id='app.protocolExplorer.tradeAmount' />,
        value: usdFormatter.format(row.tradeAmountIsUsd || 0),
      },
      {
        id: 'created',
        title: <IntlMessages id='app.protocolExplorer.created' />,
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
            row.side === 'SELL'
              ? messages['app.protocolExplorer.buy']
              : messages['app.protocolExplorer.sell']
          }
        />
      </TableCell>

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

      <TableCell align='left' className={classes.tableCell}>
        <ViewTxComponent />
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
