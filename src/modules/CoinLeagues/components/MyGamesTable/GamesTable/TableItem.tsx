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

import {useUSDFormatter} from 'hooks/utils/useUSDFormatter';
import IntlMessages from '@crema/utility/IntlMessages';
import CollapsibleTableRow from 'shared/components/CollapsibleTableRow';
import {truncateAddress} from 'utils/text';

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
      if (row.earnings[0].place === 0) {
        return <Chip label={'1'} />;
      }
      if (row.earnings[0].place === 1) {
        return <Chip label={'2'} />;
      }
      if (row.earnings[0].place === 2) {
        return <Chip label={'3'} />;
      }
    }
    return null;
  }, [row.earnings]);

  const {enterGameRoute} = useCoinLeaguesFactoryRoutes();

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
        return `${new Date(
          Number(row.endedAt) * 1000,
        ).toLocaleTimeString()}`;
      case 'Started':
        return ` ${new Date(
          Number(row.startedAt) * 1000,
        ).toLocaleTimeString()}`;
      case 'Waiting':
        return `${new Date(
          Number(row.createdAt) * 1000,
        ).toLocaleTimeString()}`;
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
        value: place,
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
        {place}
      </TableCell>
      <TableCell align='left' className={classes.tableCell}></TableCell>
      <TableCell align='left' className={classes.tableCell}></TableCell>
    </TableRow>
  );
};

export default TableItem;
