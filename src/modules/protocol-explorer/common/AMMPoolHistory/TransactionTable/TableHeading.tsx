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

const TableHeading: React.FC<Props> = (props) => {
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

  const classes = useStyles(props);
  const {messages} = useIntl();

  return (
    <TableRow className={classes.tableRowRoot}>
     
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.time' />
        </TableCell>
  
     
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.type' />
        </TableCell>

     
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.baseAmount' />
        </TableCell>

    
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.quoteAmount' />
        </TableCell>

     
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.poolVariation' />
        </TableCell>
  

   
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.baseRemaining' />
        </TableCell>


    
        <TableCell align='left' className={classes.tableCellRoot}>
          <IntlMessages id='app.quoteRemaining' />
        </TableCell>

    </TableRow>
  );
};

export default TableHeading;
