import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import {makeStyles} from '@material-ui/core/styles';
import {grey} from '@material-ui/core/colors';
import IntlMessages from '@crema/utility/IntlMessages';
import {CremaTheme} from 'types/AppContextPropsType';
import {Fonts} from 'shared/constants/AppEnums';
import {Tooltip} from '@material-ui/core';
import {useIntl} from 'react-intl';

interface Props {}

const useStyles = makeStyles((theme: CremaTheme) => ({
  tableRowRoot: {
    color: grey[500],
  },
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

const TableHeading: React.FC<Props> = (props) => {
  const classes = useStyles(props);
  const {messages} = useIntl();

  return (
    <TableRow className={classes.tableRowRoot}>
      <Tooltip title={messages['app.protocolExplorer.time']} placement='top'>
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.protocolExplorer.time' />
        </TableCell>
      </Tooltip>
      <Tooltip title={messages['app.protocolExplorer.type']} placement='top'>
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.protocolExplorer.type' />
        </TableCell>
      </Tooltip>
      <Tooltip
        title={messages['app.protocolExplorer.baseAmount']}
        placement='top'>
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.protocolExplorer.baseAmount' />
        </TableCell>
      </Tooltip>
      <Tooltip
        title={messages['app.protocolExplorer.quoteAmount']}
        placement='top'>
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.protocolExplorer.quoteAmount' />
        </TableCell>
      </Tooltip>
      <Tooltip
        title={messages['app.protocolExplorer.poolVariation']}
        placement='top'>
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.protocolExplorer.poolVariation' />
        </TableCell>
      </Tooltip>

      <Tooltip
        title={messages['app.protocolExplorer.baseRemaining']}
        placement='top'>
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.protocolExplorer.baseRemaining' />
        </TableCell>
      </Tooltip>

      <Tooltip
        title={messages['app.protocolExplorer.quoteRemaining']}
        placement='top'>
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.protocolExplorer.quoteRemaining' />
        </TableCell>
      </Tooltip>
    </TableRow>
  );
};

export default TableHeading;
