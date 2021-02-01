import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import {makeStyles} from '@material-ui/core/styles';
import {grey} from '@material-ui/core/colors';
import {Fonts} from '../../../../../../shared/constants/AppEnums';
import {CremaTheme} from '../../../../../../types/AppContextPropsType';

interface Props {
  props?: any;
}

const TableHeading: React.FC<Props> = (props) => {
  const useStyles = makeStyles((theme: CremaTheme) => ({
    tableRowRoot: {
      color: grey[500],
    },
    tableCellRoot: {
      borderBottom: '0 none',
      fontSize: 16,
      padding: 8,
      fontFamily: Fonts.BOLD,
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

  const classes = useStyles(props);
  return (
    <TableRow className={classes.tableRowRoot}>
      <TableCell className={classes.tableCellRoot}>Pair</TableCell>
      <TableCell align='left' className={classes.tableCellRoot}>
        Time
      </TableCell>
      <TableCell align='left' className={classes.tableCellRoot}>
        Type
      </TableCell>
      <TableCell align='left' className={classes.tableCellRoot}>
        Price
      </TableCell>
      <TableCell align='left' className={classes.tableCellRoot}>
       Total Value
      </TableCell>
      <TableCell align='left' className={classes.tableCellRoot}>
        Amount
      </TableCell>
      <TableCell align='left' className={classes.tableCellRoot}>
       Total
      </TableCell>
      <TableCell align='left' className={classes.tableCellRoot}>
        Pool Variation
      </TableCell>
      <TableCell align='center' className={classes.tableCellRoot}>
        Actions
      </TableCell>
    </TableRow>
  );
};

export default TableHeading;
