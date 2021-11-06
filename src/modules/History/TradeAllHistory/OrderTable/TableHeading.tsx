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

      <TableCell align='left'>
        <IntlMessages id='app.created' />
      </TableCell>
      <TableCell align='left'></TableCell>
    </TableRow>
  );
};

export default TableHeading;
