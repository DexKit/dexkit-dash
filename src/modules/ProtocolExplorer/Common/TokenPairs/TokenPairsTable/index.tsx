import React from 'react';

import {useIntl} from 'react-intl';

import {GetTokenPairs_ethereum_dexTrades} from 'services/graphql/bitquery/protocol/__generated__/GetTokenPairs';
import {EthereumNetwork, EXCHANGE} from 'shared/constants/AppEnums';

import {Box, Table, Typography} from '@material-ui/core';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import {useStyles} from './index.style';
import IntlMessages from '../../../../../@crema/utility/IntlMessages';

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
  const {messages} = useIntl();

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
          <IntlMessages id='app.protocolExplorer.noDataAvailableForToken' />
        </Typography>
      )}
    </Box>
  );
};

export default TokenPairsTable;
