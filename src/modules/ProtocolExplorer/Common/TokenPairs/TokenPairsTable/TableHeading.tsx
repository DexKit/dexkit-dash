import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import IntlMessages from '@crema/utility/IntlMessages';
import TableRow from '@material-ui/core/TableRow';
import {makeStyles} from '@material-ui/core/styles';
import {grey} from '@material-ui/core/colors';
import {CremaTheme} from 'types/AppContextPropsType';
import {Fonts, EXCHANGE} from 'shared/constants/AppEnums';
import {IS_AMM} from 'utils/protocol';

interface TableHeadingProps {
  exchange: EXCHANGE;
}

const TableHeading: React.FC<TableHeadingProps> = (props) => {
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
      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.protocolExplorer.pair' />
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.protocolExplorer.price' />
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.protocolExplorer.baseAmount24' />
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.protocolExplorer.quoteAmount24' />
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.protocolExplorer.volume24' />
      </TableCell>

      <TableCell align='left' className={classes.tableCellRoot}>
        <IntlMessages id='app.protocolExplorer.trades24' />
      </TableCell>

      {props.exchange === EXCHANGE.ALL && (
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.protocolExplorer.exchange' />
        </TableCell>
      )}

      {IS_AMM(props.exchange) && (
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.protocolExplorer.pool' />
        </TableCell>
      )}
    </TableRow>
  );
};

export default TableHeading;
