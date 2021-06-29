import React, {useState} from 'react';
import TableCell from '@material-ui/core/TableCell';
import {IconButton, makeStyles} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import TableRow from '@material-ui/core/TableRow';

import {CremaTheme} from 'types/AppContextPropsType';

import {EthereumNetwork} from 'shared/constants/AppEnums';
import CancelOrder from 'modules/Dashboard/Token/BuySell/Modal/CancelOrder';

interface TableItemProps {
  row: any;
  networkName: EthereumNetwork;
}

const TableItem: React.FC<TableItemProps> = ({row}) => {
  const useStyles = makeStyles((theme: CremaTheme) => ({
    borderBottomClass: {
      borderBottom: '0 none',
    },
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
  }));

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleCancelOpen = () => {
    setModalOpen(true);
  };

  const handleCancelClose = () => {
    setModalOpen(false);
  };

  const classes = useStyles();

  return (
    <>
      <TableRow
        key={row.transaction?.hash}
        className={classes.borderBottomClass}>
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

      <CancelOrder
        open={modalOpen}
        order={row.order}
        onClose={handleCancelClose}
      />
    </>
  );
};

export default TableItem;
