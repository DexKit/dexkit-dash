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
    <TableRow>
      <TableCell align='left'>
        <IntlMessages id='app.exchange' />
      </TableCell>

      <TableCell align='left'>
        <IntlMessages id='app.sellAmount' />
      </TableCell>

      <TableCell align='left'>
        <IntlMessages id='app.buyAmount' />
      </TableCell>

      <TableCell align='left'>
        <IntlMessages id='app.tradeAmount' />
      </TableCell>

      <TableCell align='left' colSpan={2}>
        <IntlMessages id='app.created' />
      </TableCell>
    </TableRow>
  );
};

export default TableHeading;
