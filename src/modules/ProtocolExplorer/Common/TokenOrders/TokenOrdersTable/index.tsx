import React from 'react';
import {EXCHANGE, EthereumNetwork} from 'shared/constants/AppEnums';
import {GetTokenTrades_ethereum_dexTrades} from 'services/graphql/bitquery/protocol/__generated__/GetTokenTrades';
import {
  Box,
  Fade,
  Table,
  TableBody,
  TableHead,
  TablePagination,
  Typography,
} from '@material-ui/core';
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

  return (
    <>
      <Box className={classes.tableResponsiveMaterial}>
        <Table stickyHeader>
          <TableHead>
            <TableHeading type={type} exchange={exchange} />
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
          No Data available for this token
        </Typography>
      )}
      <TablePagination
        className={classes.paginationDesktop}
        component='div'
        count={100}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        onChangePage={(event: unknown, newPage: number) =>
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
