import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import IntlMessages from '@crema/utility/IntlMessages';
import TableRow from '@material-ui/core/TableRow';
import {makeStyles} from '@material-ui/core/styles';
import {grey} from '@material-ui/core/colors';
import {Fonts} from 'shared/constants/AppEnums';
import {CremaTheme} from 'types/AppContextPropsType';

interface TableHeadingProps {}

const TableHeading: React.FC<TableHeadingProps> = () => {
  const useStyles = makeStyles((theme: CremaTheme) => ({
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

  const classes = useStyles();
  return (
    <TableRow className={classes.tableRowRoot}>
      <TableCell align='left'>
        <IntlMessages id='app.created' />
      </TableCell>

      <TableCell align='left'>
        <IntlMessages id='app.sender' />
      </TableCell>

      <TableCell align='left'>
        <IntlMessages id='app.type' />
      </TableCell>

      <TableCell align='left'>
        <IntlMessages id='app.receiver' />
      </TableCell>

      <TableCell align='left'>
        <IntlMessages id='app.amount' />
      </TableCell>

      <TableCell align='left'>
        <IntlMessages id='app.total' />
      </TableCell>

      <TableCell align='left'></TableCell>
    </TableRow>
  );
};

export default TableHeading;
