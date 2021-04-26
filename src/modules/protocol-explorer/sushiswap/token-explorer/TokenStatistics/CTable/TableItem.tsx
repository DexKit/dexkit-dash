import React from 'react';
import { useIntl } from 'react-intl';
import TableCell from '@material-ui/core/TableCell';
import {makeStyles} from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import {Fonts} from '../../../../../../shared/constants/AppEnums';
import {CremaTheme} from '../../../../../../types/AppContextPropsType';
import { Token } from 'types/app';


interface TableItemProps {
  row: {
    title: any,
    data: string|number
  };
}

const TableItem: React.FC<TableItemProps> = ({row}) => {
  const useStyles = makeStyles((theme: CremaTheme) => ({
    borderBottomClass: {
      borderBottom: '0 none',
    },
    tableCell: {
      borderBottom: '0 none',
      fontSize: 14,
      fontFamily: Fonts.MEDIUM,
      padding: 8,
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
    }
  }));
  const classes = useStyles();
  return (
    <TableRow className={classes.borderBottomClass}>
      <TableCell component='th' scope='row' className={classes.tableCell}>{row.title}</TableCell>
      <TableCell align='left' className={classes.borderBottomClass}>{row.data}</TableCell>
    </TableRow>
  );
};

export default TableItem;
