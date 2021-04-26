import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import IntlMessages from '@crema/utility/IntlMessages';
import TableRow from '@material-ui/core/TableRow';
import {makeStyles} from '@material-ui/core/styles';
import {grey} from '@material-ui/core/colors';
import {Fonts} from '../../../../../../shared/constants/AppEnums';
import {CremaTheme} from '../../../../../../types/AppContextPropsType';

interface TableHeadingProps {}

const TableHeading: React.FC<TableHeadingProps> = () => {
  const useStyles = makeStyles((theme: CremaTheme) => ({
    tableRowRoot: {
      borderBottom: '0 none',
      color: grey[500],
    },
    tableCellRoot: {
      borderBottom: '0 none',
      fontSize: 14,
      padding: 8,
      fontFamily: Fonts.LIGHT,
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
        <IntlMessages id='app.token' />
      </TableCell>
      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.tradesCount' />
      </TableCell>
      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.amount' />
      </TableCell>
      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.started' />
      </TableCell>
      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.daysTraded' />
      </TableCell>
    </TableRow>
  );
};

export default TableHeading;
