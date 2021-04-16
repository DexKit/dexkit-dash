import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import IntlMessages from '../../../../../@crema/utility/IntlMessages';
import TableRow from '@material-ui/core/TableRow';
import {makeStyles} from '@material-ui/core/styles';
import {grey} from '@material-ui/core/colors';
import {Fonts} from '../../../../../shared/constants/AppEnums';
import {CremaTheme} from '../../../../../types/AppContextPropsType';

interface TableHeadingProps {}

const TableHeading: React.FC<TableHeadingProps> = () => {
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
        <IntlMessages id='app.exchange' />
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.side' />
      </TableCell>
      
      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.pair' />
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.baseAmount' />
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.quoteAmount' />
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.price' />
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.tradeAmount' />
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.created' />
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        #
      </TableCell>
    </TableRow>
  );
};

export default TableHeading;
