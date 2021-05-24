import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import {Box, makeStyles, TableCell, TableRow} from '@material-ui/core';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import {TokenPair} from 'types/app';
import {EXCHANGE, NETWORK} from 'shared/constants/AppEnums';
import {grey} from '@material-ui/core/colors';

interface Props {
  data: TokenPair[];
  exchange: EXCHANGE;
  networkName: NETWORK;
}

const OrderTable: React.FC<Props> = ({data, exchange, networkName}) => {
  const useStyles = makeStyles(() => ({
    borderBottomClass: {
      borderBottom: '0 none',
    },
    tableResponsiveMaterial: {
      minHeight: '.01%',
      overflowX: 'auto',
      overflowY: 'hidden',
      '@media (max-width: 767px)': {
        borderTop: `1px solid ${grey[300]}`,
        width: '100%',
        marginBottom: 15,
        '& > table': {
          marginBottom: 0,
          '& > thead > tr > th, > tbody > tr > th, > tfoot > tr > th, thead > tr > td, tbody > tr > td, tfoot > tr > td': {
            whiteSpace: 'nowrap',
          },
        },
      },
    },
  }));

  const classes = useStyles();

  return (
    <Box className={classes.tableResponsiveMaterial}>
      <Table stickyHeader>
        <TableHead>
          <TableHeading exchange={exchange} />
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data
              .sort((a, b) => b.volume24InUsd - a.volume24InUsd)
              .map((row, index) => (
                <TableItem
                  row={row}
                  key={index}
                  exchange={exchange}
                  networkName={networkName}
                />
              ))
          ) : (
            <TableRow className={classes.borderBottomClass}>
              <TableCell
                component='th'
                scope='row'
                colSpan={10}
                className={classes.borderBottomClass}>
                Loading...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default OrderTable;
