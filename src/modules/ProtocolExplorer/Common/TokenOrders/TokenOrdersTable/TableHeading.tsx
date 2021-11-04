import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import IntlMessages from '@crema/utility/IntlMessages';
import TableRow from '@material-ui/core/TableRow';
import {makeStyles} from '@material-ui/core/styles';
import {CremaTheme} from 'types/AppContextPropsType';
import {Fonts, EXCHANGE} from 'shared/constants/AppEnums';

interface TableHeadingProps {
  type: 'pair' | 'token';
  exchange: EXCHANGE;
}

const useStyles = makeStyles((theme: CremaTheme) => ({
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
        <IntlMessages id='app.timestamp' />
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.type' />
      </TableCell>

      {type === 'token' && (
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.pair' />
        </TableCell>
      )}

      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.price' />
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.baseAmount' />
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.quoteAmount' />
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.total' />
      </TableCell>

      {exchange === EXCHANGE.ALL && (
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.exchange' />
        </TableCell>
      )}
      <TableCell align='left' className={classes.tableCellRoot}></TableCell>
    </TableRow>
  );
};

export default TableHeading;
