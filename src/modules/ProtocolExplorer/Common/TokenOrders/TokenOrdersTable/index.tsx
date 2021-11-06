import React from 'react';

import {useIntl} from 'react-intl';

import {EthereumNetwork, EXCHANGE} from 'shared/constants/AppEnums';
import {GetTokenTrades_ethereum_dexTrades} from 'services/graphql/bitquery/protocol/__generated__/GetTokenTrades';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import {useStyles} from './index.style';

interface Props {
  data: GetTokenTrades_ethereum_dexTrades[] | undefined;
  networkName: EthereumNetwork;
  exchange: EXCHANGE;
  type: 'pair' | 'token';
  currentPage: number;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  onChangePage: (newPage: number) => void;
  onChangeRowsPerPage: (newPerPage: number) => void;
}

const TokenOrdersTable: React.FC<Props> = ({
  data,
  networkName,
  exchange,
  type,
  currentPage,
  rowsPerPage,
  rowsPerPageOptions,
  onChangePage,
  onChangeRowsPerPage,
}) => {
  const classes = useStyles();
  const {messages} = useIntl();
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

  return (
    <>
      <Box className={classes.tableResponsiveMaterial}>
        <Table stickyHeader>
          <TableHead>
            {!isMobile && <TableHeading type={type} exchange={exchange} />}
          </TableHead>

          <TableBody>
            {data &&
              data.map((row, index) => (
                <TableItem
                  key={index}
                  row={row}
                  networkName={networkName}
                  exchange={exchange}
                  type={type}
                />
              ))}
          </TableBody>
        </Table>
      </Box>
      {!data?.length && (
        <Typography component='h1' color={'primary'}>
          <IntlMessages id='app.protocolExplorer.noDataAvailableForToken' />
        </Typography>
      )}
      <TablePagination
        className={classes.paginationDesktop}
        component='div'
        count={100}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        onPageChange={(event: unknown, newPage: number) =>
          onChangePage(newPage)
        }
        onChangeRowsPerPage={(event: React.ChangeEvent<HTMLInputElement>) =>
          onChangeRowsPerPage(parseInt(event.target.value, 10))
        }
      />
    </>
  );
};

export default TokenOrdersTable;
