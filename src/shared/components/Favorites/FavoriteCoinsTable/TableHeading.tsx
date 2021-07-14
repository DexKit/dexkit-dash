import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import {makeStyles} from '@material-ui/core';
import IntlMessages from '@crema/utility/IntlMessages';
import { Fonts } from 'shared/constants/AppEnums';
import { CremaTheme } from 'types/AppContextPropsType';



const useStyles = makeStyles((theme: CremaTheme) => ({
  borderBottomClass: {
    borderBottom: '0 none',
  },
  tableCell: {
    borderBottom: '0 none',
    fontSize: 16,
    padding: 8,
    '&:first-child': {
      paddingLeft: 20,
    },
    '&:last-child': {
      paddingRight: 20,
    },
  },
}));

interface TableHeadingPorps {}

const TableHeading: React.FC<TableHeadingPorps> = () => {
  const classes = useStyles();
  return (
    <TableRow className={classes.borderBottomClass}>
      <TableCell align='left' className={classes.tableCell}>
        <IntlMessages id='common.name' />
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
        <IntlMessages id='app.price' />
      </TableCell>  
      <TableCell align='left' className={classes.tableCell}>
        <IntlMessages id='dashboard.24h' /> %
      </TableCell>
      <TableCell align='right' className={classes.tableCell}>
        <IntlMessages id='app.actions' />
      </TableCell>
    </TableRow>
  );
};

export default TableHeading;
