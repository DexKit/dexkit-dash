import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import IntlMessages from '@crema/utility/IntlMessages';
import TableRow from '@material-ui/core/TableRow';
import {makeStyles} from '@material-ui/core/styles';
import {grey} from '@material-ui/core/colors';
import { CremaTheme } from 'types/AppContextPropsType';
import { Fonts, EXCHANGE } from 'shared/constants/AppEnums';

interface TableHeadingProps {
  type: 'pair' | 'token';
  exchange: EXCHANGE
}

const TableHeading: React.FC<TableHeadingProps> = ({type, exchange}) => {
  const useStyles = makeStyles((theme: CremaTheme) => ({
    tableRowRoot: {
      color: grey[500],
    },
    tableCellRoot: {
      borderBottom: '0 none',
      fontSize: 16,
      padding: 8,
      fontFamily: Fonts.BOLD,
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
  }));

  const classes = useStyles();
  return (
    <TableRow className={classes.tableRowRoot}>
      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.timestamp' />
      </TableCell>
      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.type' />
      </TableCell>
{type === 'token' && <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.pair' />
      </TableCell>}
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
      {exchange === EXCHANGE.ALL && <TableCell align='left' className={classes.tableCellRoot}>
         <IntlMessages id='app.protocol' />
      </TableCell>}
      <TableCell align='left' className={classes.tableCellRoot}>
        #
      </TableCell>
    </TableRow>
  );
};

export default TableHeading;
