import React from 'react';

import {useIntl} from 'react-intl';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import {makeStyles} from '@material-ui/core/styles';
import {grey} from '@material-ui/core/colors';
import {Fonts} from '../../../../../shared/constants/AppEnums';
import IntlMessages from '../../../../../@crema/utility/IntlMessages';

interface Props {
  props?: any;
}

const TableHeading: React.FC<Props> = (props) => {
  const useStyles = makeStyles((theme) => ({
    tableRowRoot: {
      color: grey[500],
    },
    tableCellRoot: {
      backgroundColor: theme.palette.background.paper,
      borderBottom: '0 none',
      fontSize: 16,
      padding: 8,
      fontFamily: Fonts.LIGHT,
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

  const classes = useStyles(props);
  const {messages} = useIntl();

  return (
    <TableRow className={classes.tableRowRoot}>
      <TableCell className={classes.tableCellRoot}>
        <IntlMessages id='app.dashboard.name' />
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.dashboard.balance' />
      </TableCell>

      <TableCell align='center' className={classes.tableCellRoot}>
        <IntlMessages id='app.dashboard.actions' />
      </TableCell>
    </TableRow>
  );
};

export default TableHeading;
