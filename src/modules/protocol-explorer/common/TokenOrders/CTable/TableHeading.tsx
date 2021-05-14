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
  type: 'pair' | 'token';
  exchange: EXCHANGE;
}

const TableHeading: React.FC<TableHeadingProps> = ({type, exchange}) => {
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
      <Tooltip title={messages['app.timestamp']} placement='top'>
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.timestamp' />
        </TableCell>
      </Tooltip>

      <Tooltip title={messages['app.type']} placement='top'>
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.type' />
        </TableCell>
      </Tooltip>
      {type === 'token' && (
        <Tooltip title={messages['app.pair']} placement='top'>
          <TableCell align='left' className={classes.tableCellRoot}>
            <IntlMessages id='app.pair' />
          </TableCell>
        </Tooltip>
      )}

      <Tooltip title={messages['app.price']} placement='top'>
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.price' />
        </TableCell>
      </Tooltip>

      <Tooltip title={messages['app.baseAmount']} placement='top'>
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.baseAmount' />
        </TableCell>
      </Tooltip>

      <Tooltip title={messages['app.quoteAmount']} placement='top'>
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.quoteAmount' />
        </TableCell>
      </Tooltip>

      <Tooltip title={messages['app.total']} placement='top'>
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.total' />
        </TableCell>
      </Tooltip>

      {exchange === EXCHANGE.ALL && (
        <Tooltip title={messages['app.protocol']} placement='top'>
          <TableCell align='left' className={classes.tableCellRoot}>
            <IntlMessages id='app.protocol' />
          </TableCell>
        </Tooltip>
      )}
      <TableCell align='left' className={classes.tableCellRoot}></TableCell>
    </TableRow>
  );
};

export default TableHeading;
