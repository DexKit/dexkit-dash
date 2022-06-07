import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import {makeStyles} from '@material-ui/core';
import {Link as RouterLink} from 'react-router-dom';
import {useCoinLeaguesFactoryRoutes} from 'modules/CoinLeague/hooks/useCoinLeaguesFactory';
import {CremaTheme} from 'types/AppContextPropsType';
import {truncateAddress} from 'utils/text';

interface Props {
  data: any;
  isNFT: boolean;
}

const useStyles = makeStyles((theme: CremaTheme) => ({
  tableCell: {
    fontSize: 16,
    padding: '12px 8px',
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
  anchar: {
    color: theme.palette.primary.main,
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    display: 'inline-block',
  },
  badgeRoot: {
    padding: '3px 10px',
    borderRadius: 4,
    display: 'inline-block',
  },
}));

const TableItem: React.FC<Props> = ({data, isNFT}) => {
  const classes = useStyles();
  const {enterGameRoute} = useCoinLeaguesFactoryRoutes(isNFT);
  const createdFn = data.createdAt
    ? new Date(Number(data.createdAt) * 1000)
    : new Date();

  return (
    <TableRow hover role='checkbox' tabIndex={-1} key={data.transaction?.hash}>
      <TableCell component='th' scope='row' className={classes.tableCell}>
        <Box>{createdFn.toLocaleDateString()}</Box>
        <Box>{createdFn.toLocaleTimeString()}</Box>
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        <Box p={2}>
          <Link
            color='inherit'
            component={RouterLink}
            to={enterGameRoute(data?.game?.intId)}>
            {data?.game?.intId}
          </Link>
        </Box>
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {data?.type}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        <Box display='flex' alignItems='center'>
          <Link
            color='inherit'
            target='_blank'
            href={`https://polygonscan.com/address/${data?.player?.id}`}>
            {truncateAddress(data?.player?.id)}
          </Link>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
