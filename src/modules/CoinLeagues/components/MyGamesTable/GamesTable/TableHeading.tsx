import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import {makeStyles} from '@material-ui/core/styles';
import {CremaTheme} from 'types/AppContextPropsType';
import {Fonts} from 'shared/constants/AppEnums';

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

const TableHeading: React.FC = () => {
  const classes = useStyles();

  return (
    <TableRow>
      <TableCell align='left' className={classes.tableCellRoot}>
        {'Created-Started-Ended'}
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        {'Game'}
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        {'Status'}
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        {'Place'}
      </TableCell>
      <TableCell align='left' className={classes.tableCellRoot}></TableCell>
    </TableRow>
  );
};

export default TableHeading;
