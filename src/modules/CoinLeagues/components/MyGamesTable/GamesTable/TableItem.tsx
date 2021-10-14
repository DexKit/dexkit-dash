import React, {useMemo} from 'react';
import Box from '@material-ui/core/Box';
import {
  TableRow,
  TableCell,
  makeStyles,
  Chip,
  useMediaQuery,
  Link,
} from '@material-ui/core';

import {Link as RouterLink, useHistory} from 'react-router-dom';
import {useCoinLeaguesFactoryRoutes} from 'modules/CoinLeagues/hooks/useCoinLeaguesFactory';
import {CremaTheme} from 'types/AppContextPropsType';

import CollapsibleTableRow from 'shared/components/CollapsibleTableRow';
import {truncateAddress} from 'utils/text';
import {ethers} from 'ethers';
import {ReactComponent as CupIcon} from 'assets/images/icons/cup-white.svg';

interface TableItemProps {
  row: any;
}

const useStyles = makeStyles((theme: CremaTheme) => ({
  tableCell: {
    fontSize: 16,
    padding: '12px 8px',
    '&:first-child': {
      paddingLeft: 20,
    },
    '&:last-child': {
      paddingRight: 20,
    },
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
  borderBottomClass: {
    borderBottom: '0 none',
  },
}));

const TableItem: React.FC<TableItemProps> = ({row}) => {
  const classes = useStyles();
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  const {enterGameRoute} = useCoinLeaguesFactoryRoutes();

  const paymentTypeColor = useMemo(() => {
    switch (row.status) {
      case 'Ended':
        return '#2A2C31';
      case 'Started':
        return '#008148';
      case 'Waiting':
        return '#C46D5E';
      default:
        return '#E2A72E';
    }
  }, [row.status]);

  const place = useMemo(() => {
    if (row.earnings && row.earnings[0]) {
      if (row.earnings[0].place === '0') {
        return (
          <Chip color='primary' icon={<CupIcon />} label={`1`} size='small' />
        );
      }
      if (row.earnings[0].place === '1') {
        return (
          <Chip color='primary' icon={<CupIcon />} label={`2`} size='small' />
        );
      }
      if (row.earnings[0].place === '2') {
        return (
          <Chip color='primary' icon={<CupIcon />} label={`3`} size='small' />
        );
      }
    }
    if (row.status !== 'Ended') {
      return '-';
    } else {
      return 'No wins';
    }
  }, [row.earnings, row.status]);

  const claimed = useMemo(() => {
    if (row.earnings && row.earnings[0]) {
      if (row.earnings[0].claimed === true) {
        return (
          <Box p={2}>
            {`Claimed ${ethers.utils.formatEther(
              row.earnings[0].amount,
            )} MATIC`}
          </Box>
        );
      } else {
        return (
          <Box p={2}>
            <Link
              color='inherit'
              component={RouterLink}
              to={enterGameRoute(row.id)}>
              {'Not Claimed Yet.'}
            </Link>
          </Box>
        );
      }
    }
    return null;
  }, [row.earnings]);

  const createdDateFn = useMemo(() => {
    switch (row.status) {
      case 'Ended':
        return `Ended: ${new Date(
          Number(row.endedAt) * 1000,
        ).toLocaleDateString()}`;
      case 'Started':
        return `Started: ${new Date(
          Number(row.startedAt) * 1000,
        ).toLocaleDateString()}`;
      case 'Waiting':
        return `Created: ${new Date(
          Number(row.createdAt) * 1000,
        ).toLocaleDateString()}`;
    }
  }, [row.status]);

  const createdTimeFn = useMemo(() => {
    switch (row.status) {
      case 'Ended':
        return `${new Date(Number(row.endedAt) * 1000).toLocaleTimeString()}`;
      case 'Started':
        return ` ${new Date(
          Number(row.startedAt) * 1000,
        ).toLocaleTimeString()}`;
      case 'Waiting':
        return `${new Date(Number(row.createdAt) * 1000).toLocaleTimeString()}`;
    }
  }, [row.status]);

  if (isMobile) {
    const summaryTitle = `Game ${truncateAddress(row.id)}`;
    const summaryValue = (
      <Chip
        style={{backgroundColor: paymentTypeColor, color: 'white'}}
        label={row.status}
      />
    );

    const data = [
      {
        id: 'timestamp',
        title: 'Created-Started-Ended',
        value: (
          <>
            {' '}
            <Box>{createdDateFn}</Box>
            <Box>{createdTimeFn}</Box>
          </>
        ),
      },
      {
        id: 'game',
        title: 'Game',
        value: (
          <Link
            color='inherit'
            component={RouterLink}
            to={enterGameRoute(row.id)}>
            {truncateAddress(row.id)}
          </Link>
        ),
      },
      {
        id: 'status',
        title: 'Status',
        value: (
          <Chip
            style={{backgroundColor: paymentTypeColor, color: 'white'}}
            label={row.status}
          />
        ),
      },
      {
        id: 'place',
        title: 'Place',
        value: (
          <Box display={'flex'} alignItems={'center'}>
            {place}
            {claimed}
          </Box>
        ),
      },
    ];

    return (
      <TableRow
        key={row.transaction?.hash}
        className={classes.borderBottomClass}>
        <CollapsibleTableRow
          summaryValue={summaryValue}
          summaryTitle={summaryTitle}
          data={data}
        />
      </TableRow>
    );
  }

  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      <TableCell component='th' scope='row' className={classes.tableCell}>
        <Box>{createdDateFn}</Box>
        <Box>{createdTimeFn}</Box>
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
        <Link
          color='inherit'
          component={RouterLink}
          to={enterGameRoute(row.id)}>
          {truncateAddress(row.id)}
        </Link>
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        <Chip
          style={{backgroundColor: paymentTypeColor, color: 'white'}}
          label={row.status}
        />
      </TableCell>
      <TableCell align='left' className={classes.tableCell}>
        <Box display={'flex'} alignItems={'center'}>
          {place}
          {claimed}
        </Box>
      </TableCell>
      <TableCell align='left' className={classes.tableCell}></TableCell>
      <TableCell align='left' className={classes.tableCell}></TableCell>
    </TableRow>
  );
};

export default TableItem;
