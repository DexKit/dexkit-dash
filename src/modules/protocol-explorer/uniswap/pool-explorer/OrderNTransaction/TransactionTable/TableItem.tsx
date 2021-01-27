import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import {TransactionDataNew} from '../../../../../../types/models/Analytics';
import {makeStyles, Button, Chip} from '@material-ui/core';
import {CremaTheme} from '../../../../../../types/AppContextPropsType';

interface Props {
  data: TransactionDataNew;
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
    if(data.poolVariation > 0){
      return '#00b400';
    }
    if(data.poolVariation < 0){
      return '#F84E4E';
    }
    else {
      return 'none'
    }
  };

  return (
    <TableRow key={data.id}>
      <TableCell component='th' scope='row' className={classes.tableCell}>
        <Box >{data.pair}</Box>
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
        {data.time}
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
      <Chip
        style={ {backgroundColor:getPaymentTypeColor(), color: 'white'}}
        label={data.type}
        clickable
      />
      </TableCell>
      <TableCell
        align='left'
        className={classes.tableCell}
       >
        {data.price}
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
        <Box
          className={classes.badgeRoot}
         >
          {data.totalValue}
        </Box>
      </TableCell>
      <TableCell align='right' className={classes.tableCell}>
        {data.amount}
      </TableCell>
      <TableCell align='right' className={classes.tableCell}>
      {data.total}
      </TableCell>
      <TableCell style={{color: getPaymentStatusColor(),}}  align='right' className={classes.tableCell}>
        {data.poolVariation}%
      </TableCell>
      <TableCell align='right' className={classes.tableCell}>
      <Button variant="outlined" style={{marginRight: 10}}    >
        Buy
      </Button>
      <Button variant="outlined" style={{marginRight: 10}}  color="primary" >
        Add
      </Button>
      <Button variant="outlined" color="secondary" >
        Remove
      </Button>
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
