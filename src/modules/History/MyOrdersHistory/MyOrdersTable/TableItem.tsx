import React, {useState} from 'react';
import {IconButton, makeStyles, TableRow, TableCell} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelOrder from 'modules/Dashboard/Token/BuySell/Modal/CancelOrder';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import IntlMessages from '@crema/utility/IntlMessages';
import CollapsibleTableRow from 'shared/components/CollapsibleTableRow'

type TableItemContainerProps = {
  row: any;
};

type TableItemProps = {
  handleCancelOpen: () => void;
} & TableItemContainerProps;

const useStyles = makeStyles(() => ({
  borderBottomClass: {
    borderBottom: '0 none',
  },
  tableCell: {
    backgroundColor: 'transparent',
    borderBottom: '0 none',
    fontSize: 16,
  },
}));

const TableItemContainer: React.FC<TableItemContainerProps> = ({row}) => {
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const handleCancelOpen = () => {
    setModalOpen(true);
  };
  const handleCancelClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      {isMobile ? (
        <MobileTableItem row={row} handleCancelOpen={handleCancelOpen} />
      ) : (
        <TableItem handleCancelOpen={handleCancelOpen} row={row} />
      )}
      <CancelOrder
        open={modalOpen}
        order={row.order}
        onClose={handleCancelClose}
      />
    </>
  );
};

const TableItem: React.FC<TableItemProps> = ({row, handleCancelOpen}) => {
  const classes = useStyles();
  return (
    <TableRow key={row.transaction?.hash} className={classes.borderBottomClass}>
      <TableCell align='left' className={classes.tableCell}>
        {Number(row.order.makerAmountFn).toFixed(2)}{' '}
        {row.order?.makerTokenFn?.symbol}{' '}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {Number(row.order.takerAmountFn).toFixed(2)}{' '}
        {row.order?.takerTokenFn?.symbol}{' '}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {(
          Number(row.order.takerAmountFn) -
          Number(row.metaData.remainingFillableTakerAmountFn)
        ).toFixed(2)}{' '}
        {row.order?.takerTokenFn?.symbol}{' '}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {new Date(row.order.expiry * 1000).toLocaleDateString()}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {/* <Link href={`/${networkName}/history/order/view/${row.metaData.orderHash}`}>
        <SearchIcon />
      </Link> */}
        <IconButton aria-label='cancel' onClick={handleCancelOpen}>
          <DeleteIcon color='primary' />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const MobileTableItem: React.FC<TableItemProps> = ({row, handleCancelOpen}) => {
  const {borderBottomClass} = useStyles();
  const summaryTitle = <IntlMessages id='app.buyAmount' />;
  const summaryValue = `${Number(row.order.makerAmountFn).toFixed(2)} ${
    row.order?.makerTokenFn?.symbol
  }`;

  const data = [
    {
      id: 'sellAmount',
      title: <IntlMessages id='app.sellAmount' />,
      value: `${Number(row.order.takerAmountFn).toFixed(2)} ${
        row.order?.takerTokenFn?.symbol
      }`,
    },
    {
      id: 'fill',
      title: <IntlMessages id='app.filled' />,
      value: `${(
        Number(row.order.takerAmountFn) -
        Number(row.metaData.remainingFillableTakerAmountFn)
      ).toFixed(2)} ${row.order?.takerTokenFn?.symbol}`,
    },
    {
      id: 'expiry',
      title: <IntlMessages id='app.expiry' />,
      value: new Date(row.order.expiry * 1000).toLocaleDateString(),
    },
    {
      id: 'cancel',
      title: 'Delete',
      value: (
        <IconButton aria-label='cancel' onClick={handleCancelOpen}>
          <DeleteIcon color='primary' />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <TableRow key={row.transaction?.hash} className={borderBottomClass}>
        <CollapsibleTableRow
          data={data}
          summaryValue={summaryValue}
          summaryTitle={summaryTitle}
        />
      </TableRow>
    </>
  );
};

export default TableItemContainer;
