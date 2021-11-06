import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import IntlMessages from '@crema/utility/IntlMessages';
import TableRow from '@material-ui/core/TableRow';
import {makeStyles} from '@material-ui/core/styles';
import {EXCHANGE, Fonts} from 'shared/constants/AppEnums';

interface TableHeadingProps {
  type: 'pair' | 'token';
  exchange: EXCHANGE;
}

const useStyles = makeStyles((theme) => ({
  tableCellRoot: {
    color: '#8F96A7',
    borderBottom: '0 none',
    fontSize: 16,
    padding: 8,
    fontFamily: Fonts.LIGHT,
    '&:first-child': {
      paddingLeft: 20,
    },
    '&:last-child': {
      paddingRight: 20,
    },
  },
}));

const TableHeading: React.FC<TableHeadingProps> = ({type, exchange}) => {
  const classes = useStyles();

  return (
    <TableRow>
      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.protocolExplorer.timestamp' />
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.protocolExplorer.type' />
      </TableCell>

      {type === 'token' && (
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.protocolExplorer.pair' />
        </TableCell>
      )}

      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.protocolExplorer.price' />
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.protocolExplorer.baseAmount' />
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.protocolExplorer.quoteAmount' />
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.protocolExplorer.total' />
      </TableCell>

      {exchange === EXCHANGE.ALL && (
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.protocolExplorer.exchange' />
        </TableCell>
      )}
      <TableCell align='left' className={classes.tableCellRoot} />
    </TableRow>
  );
};

export default TableHeading;
