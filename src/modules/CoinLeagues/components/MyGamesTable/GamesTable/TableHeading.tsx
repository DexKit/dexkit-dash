import React from 'react';

import {useIntl} from 'react-intl';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import {makeStyles} from '@material-ui/core/styles';
import {Fonts} from 'shared/constants/AppEnums';

const useStyles = makeStyles(() => ({
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

const TableHeading: React.FC = () => {
  const classes = useStyles();
  const {messages} = useIntl();

  return (
    <TableRow>
      <TableCell align='left' className={classes.tableCellRoot}>
        {'Created-Started-Ended'}
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        {messages['app.games']}
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        {messages['app.status']}
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        {messages['app.place']}
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot} />
    </TableRow>
  );
};

export default TableHeading;
