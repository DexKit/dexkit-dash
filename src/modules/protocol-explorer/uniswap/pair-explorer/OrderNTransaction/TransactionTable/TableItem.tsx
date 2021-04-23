import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import {makeStyles, Chip} from '@material-ui/core';
import {CremaTheme} from '../../../../../../types/AppContextPropsType';
import { OrderData } from 'types/app';
import { Link } from 'react-router-dom';

interface Props {
  data: OrderData;
}

const useStyles = makeStyles((theme: CremaTheme) => ({
  tableCell: {
    fontSize: 16,
    padding: '12px 8px',
    '&:first-child': {
      [theme.breakpoints.up('xl')]: {
        paddingLeft: 4,
      },
    },
    '&:last-child': {
      [theme.breakpoints.up('xl')]: {
        paddingRight: 4,
      },
    },
    [theme.breakpoints.up('xl')]: {
      fontSize: 18,
      padding: 16,
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

const TableItem: React.FC<Props> = ({data}) => {
  const classes = useStyles();
  
  const getPaymentTypeColor = () => {
    switch (data.side) {
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
  };

  
  const createdFn = data.created.split(' ')
 

  return (
    <TableRow key={data.hash}>
      <TableCell component='th' scope='row' className={classes.tableCell}>
        <Box>{createdFn[0]}</Box>
        <Box>{createdFn[1]}</Box>
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        <Chip style={ {backgroundColor:getPaymentTypeColor(), color: 'white'}} label={data.side} clickable />
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        ${(data.quoteAmountUsd / data.baseAmountUsd).toFixed(2)}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {data.baseAmount.toFixed(4)} <Link to={`/protocol-explorer/uniswap/token-explorer/${data.baseToken.address}`}>{data.baseToken.symbol}</Link>
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {data.quoteAmount.toFixed(4)} <Link to={`/protocol-explorer/uniswap/token-explorer/${data.quoteToken.address}`}>{data.quoteToken.symbol}</Link>
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>       
        ${data.tradeAmountUsd.toFixed(2)}
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
