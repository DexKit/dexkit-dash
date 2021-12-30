import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import {makeStyles} from '@material-ui/core/styles';
import {grey} from '@material-ui/core/colors';
import IntlMessages from '@crema/utility/IntlMessages';
import {Fonts} from 'shared/constants/AppEnums';

interface Props {
  props?: any;
}

const useStyles = makeStyles((theme) => ({
  tableRowRoot: {
    color: grey[500],
  },
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

const TableHeading: React.FC<Props> = (props) => {
  const classes = useStyles(props);

  return (
    <TableRow className={classes.tableRowRoot}>
      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.protocolExplorer.time' />
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.protocolExplorer.type' />
      </TableCell>

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
        <IntlMessages id='app.protocolExplorer.tradeAmount' />
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot} />
    </TableRow>
  );
};

export default TableHeading;
