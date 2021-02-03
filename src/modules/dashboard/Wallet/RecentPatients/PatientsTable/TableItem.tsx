import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core';
import {green, red} from '@material-ui/core/colors';
import {Fonts} from '../../../../../shared/constants/AppEnums';
import clsx from 'clsx';
// import AppMenu from '../../../../../@crema/core/AppMenu';
import Avatar from '@material-ui/core/Avatar';
import PageviewIcon from '@material-ui/icons/Pageview';
import {CremaTheme} from '../../../../../types/AppContextPropsType';
import { NewPopularCoinsData} from '../../../../../types/models/Crypto';

interface TableItemProps {
  data: NewPopularCoinsData;
}

const TableItem: React.FC<TableItemProps> = ({data}) => {
  const useStyles = makeStyles((theme: CremaTheme) => ({
    borderBottomClass: {
      borderBottom: '0 none',
    },
    tableCell: {
      borderBottom: '0 none',
      fontSize: 12,
      padding: 6,
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
    tableCellColor: {
      color: green[600],
    },
    fontBold: {
      fontFamily: Fonts.MEDIUM,
    },
    whitespaceNowrap: {
      whiteSpace: 'nowrap',
    },
    avatar: (props: any) => ({
      width: 40,
      height: 40,
      padding: 12,
      backgroundColor: props.image ? props.color : red[500],
      [theme.breakpoints.up('xl')]: {
        width: 50,
        height: 50,
      },
    }),
  }));
  const classes = useStyles(data);

  return (
    <TableRow key={data.name} className='item-hover'>
      <TableCell component='th' scope='row' className={classes.tableCell}>
      <TableCell
        align='left'
        className={clsx(classes.tableCell, classes.whitespaceNowrap)}>
        <Box display='flex'>
          <Box mr={{xs: 3, xl: 5}}>
            {data.image ? (
              <Avatar className={classes.avatar}>
                <img src={data.image} alt='' />
              </Avatar>
            ) : (
              <Avatar className={classes.avatar}>
                <PageviewIcon />
              </Avatar>
            )}
          </Box>
          <Box component='span' mt={3} mr={1} fontWeight={700}>
            {data.name}
          </Box>
          <Box color='grey.500' ml={1} mt={3}>
            ({data.shortName})
          </Box>
        </Box>
      </TableCell>
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
        {data.volume} (32434 {data.shortName})
      </TableCell>
      <TableCell align='center'>
      <Button style={{marginRight: 10}} variant="contained" color="secondary"  >
        Send
      </Button>
      <Button variant="contained" color="primary" >
        Trade
      </Button>
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
