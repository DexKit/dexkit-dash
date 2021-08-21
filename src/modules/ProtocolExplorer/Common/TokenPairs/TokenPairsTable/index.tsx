import React from 'react';
import {GetTokenPairs_ethereum_dexTrades} from 'services/graphql/bitquery/protocol/__generated__/GetTokenPairs';
import {EXCHANGE, EthereumNetwork} from 'shared/constants/AppEnums';

import {Box, Table, TableCell, TableRow, Typography} from '@material-ui/core';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import {useStyles} from './index.style';

interface Props {
  networkName: EthereumNetwork;
  data: GetTokenPairs_ethereum_dexTrades[] | undefined;
  exchange: EXCHANGE;
  currentPage: number;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  onChangePage: (newPage: number) => void;
  onChangeRowsPerPage: (newPerPage: number) => void;
}

const TokenPairsTable: React.FC<Props> = ({data, exchange, networkName}) => {
  const classes = useStyles();

  return (
    <Box className={classes.tableResponsiveMaterial}>
      <Table stickyHeader>
        <TableHead>
          <TableHeading exchange={exchange} />
        </TableHead>
        <TableBody>
          {data &&
            data.map((row, index) => (
              <TableItem
                row={row}
                key={index}
                exchange={exchange}
                networkName={networkName}
              />
            ))}
          {/* (
            <TableRow className={classes.borderBottomClass}>
              <TableCell
                component='th'
                scope='row'
                colSpan={10}
                className={classes.borderBottomClass}>
                Loading...
              </TableCell>
            </TableRow>
          )} */}
        </TableBody>
      </Table>
      {!data?.length && (
        <Typography component='h1' color={'primary'}>
          No Data available for this token
        </Typography>
      )}
    </Box>
  );
};

export default TokenPairsTable;
