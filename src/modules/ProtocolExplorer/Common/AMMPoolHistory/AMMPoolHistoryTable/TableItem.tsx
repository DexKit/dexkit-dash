import React, {useMemo} from 'react';
import {CremaTheme} from 'types/AppContextPropsType';
import {EXCHANGE, EthereumNetwork} from 'shared/constants/AppEnums';
import {
  Box,
  TableCell,
  TableRow,
  Chip,
  makeStyles,
  useMediaQuery,
} from '@material-ui/core';

import IntlMessages from '@crema/utility/IntlMessages';

import {MintBurn} from 'types/app';
import CollapsibleTableRow from 'shared/components/CollapsibleTableRow';
import {ViewTx} from 'shared/components/ViewTx';
import {useIntl} from 'react-intl';

interface Props {
  row: MintBurn;
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
  const {messages} = useIntl();
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  const paymentTypeColor = useMemo(() => {
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
  }, [row.type]);

  const paymentStatusColor = useMemo(() => {
    if (row.variation > 0) {
      return '#00b400';
    } else if (row.variation < 0) {
      return '#F84E4E';
    } else {
      return 'none';
    }
  }, [row.variation]);

  const baseAmountRow = (
    <>
      {row.amount0.toFixed(2)} {row.baseCurrency?.symbol}
    </>
  );

  const quoteAmountRow = (
    <>
      {row.amount1.toFixed(2)} {row.quoteCurrency?.symbol}
    </>
  );

  const poolVariationRow = (
    <>
      <Box
        className={classes.badgeRoot}
        style={{
          color: paymentStatusColor,
          backgroundColor: paymentStatusColor + '44',
        }}>
        {row.variation.toFixed(2)}%
      </Box>
    </>
  );

  const baseRemainingRow = (
    <>
      <Box className={classes.badgeRoot}>
        {row.reserve0.toFixed(2)} {row.baseCurrency?.symbol}
      </Box>
    </>
  );

  const quoteRemainingRow = (
    <>
      <Box className={classes.badgeRoot}>
        {row.reserve1.toFixed(2)} {row.quoteCurrency?.symbol}
      </Box>
    </>
  );

  const timeFn = new Date(row?.time || 0);
  const ViewTxComponent = React.useMemo(
    () => () => <ViewTx networkName={networkName} hash={row.hash || ''} />,
    [networkName, row.hash],
  );

  const timestamp = row?.time
    ? new Date(row?.time).toLocaleString()
    : row?.time;

  if (isMobile) {
    const summaryTitle = (
      <Chip
        style={{backgroundColor: paymentTypeColor, color: 'white'}}
        label={row.type}
      />
    );
    const summaryValue = `${row.amount0.toFixed(2)} ${
      row.baseCurrency?.symbol
    } ${messages['app.protocolExplorer.and']} ${row.amount1.toFixed(2)} ${
      row.quoteCurrency?.symbol
    }`;
    const data = [
      {
        id: 'type',
        title: <IntlMessages id='app.protocolExplorer.type' />,
        value: (
          <Chip
            style={{backgroundColor: paymentTypeColor, color: 'white'}}
            label={row.type}
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
        id: 'poolVariation',
        title: <IntlMessages id='app.protocolExplorer.poolVariation' />,
        value: poolVariationRow,
      },
      {
        id: 'baseRemaining',
        title: <IntlMessages id='app.protocolExplorer.baseRemaining' />,
        value: baseRemainingRow,
      },
      {
        id: 'quoteRemaining',
        title: <IntlMessages id='app.protocolExplorer.quoteRemaining' />,
        value: quoteRemainingRow,
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
      <TableRow key={row.hash} className={classes.borderBottomClass}>
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
        <Box>{timeFn.toLocaleDateString()}</Box>
        <Box>{timeFn.toLocaleTimeString()}</Box>
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        <Chip
          style={{backgroundColor: paymentTypeColor, color: 'white'}}
          label={row.type}
        />
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {baseAmountRow}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {quoteAmountRow}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {poolVariationRow}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {baseRemainingRow}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {quoteRemainingRow}
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
        <ViewTxComponent />
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
