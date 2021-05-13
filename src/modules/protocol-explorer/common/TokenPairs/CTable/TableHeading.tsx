import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import IntlMessages from '@crema/utility/IntlMessages';
import TableRow from '@material-ui/core/TableRow';
import {makeStyles} from '@material-ui/core/styles';
import {grey} from '@material-ui/core/colors';
import {CremaTheme} from 'types/AppContextPropsType';
import {Fonts, EXCHANGE} from 'shared/constants/AppEnums';
import {useIntl} from 'react-intl';
import {Tooltip} from '@material-ui/core';

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
  const {messages} = useIntl();

  return (
    <TableRow className={classes.tableRowRoot}>
      <Tooltip title={messages['app.pair']} placement='top'>
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.pair' />
        </TableCell>
      </Tooltip>
      <Tooltip title={messages['app.price']} placement='top'>
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.price' />
        </TableCell>
      </Tooltip>

      <Tooltip title={messages['app.baseAmount24']} placement='top'>
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.baseAmount24' />
        </TableCell>
      </Tooltip>

      <Tooltip title={messages['app.quoteAmount24']} placement='top'>
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.quoteAmount24' />
        </TableCell>
      </Tooltip>

      <Tooltip title={messages['app.volume24']} placement='top'>
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.volume24' />
        </TableCell>
      </Tooltip>

      <Tooltip title={messages['app.trades24']} placement='top'>
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.trades24' />
        </TableCell>
      </Tooltip>

      {props.exchange === EXCHANGE.ALL && (
        <Tooltip title={messages['app.protocol']} placement='top'>
          <TableCell align='left' className={classes.tableCellRoot}>
            <IntlMessages id='app.protocol' />
          </TableCell>
        </Tooltip>
      )}
    </TableRow>
  );
};

export default TableHeading;
