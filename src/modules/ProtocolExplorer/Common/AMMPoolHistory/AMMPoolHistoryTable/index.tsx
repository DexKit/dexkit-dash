import React from 'react';
import {GetTokenTrades_ethereum_dexTrades} from 'services/graphql/bitquery/protocol/__generated__/GetTokenTrades';
import {EXCHANGE, EthereumNetwork} from 'shared/constants/AppEnums';
import {CremaTheme} from 'types/AppContextPropsType';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import {Box, makeStyles, TablePagination} from '@material-ui/core';
import {grey} from '@material-ui/core/colors';
import Loader from '@crema/core/Loader';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import {useStyles} from './index.style';
import {MintBurn} from 'types/app';

interface Props {
  exchange: EXCHANGE;
  networkName: EthereumNetwork;
  data: MintBurn[] | undefined;
  totalRows: number | undefined;
  currentPage: number;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  onChangePage: (newPage: number) => void;
  onChangeRowsPerPage: (newPerPage: number) => void;
}

const AMMPoolHistoryTable: React.FC<Props> = ({
  exchange,
  networkName,
  data,
  totalRows,
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
            <TableHeading />
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
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        className={classes.paginationDesktop}
        component='div'
        count={totalRows || 0}
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
      <TablePagination
        className={classes.paginationMobile}
        component='div'
        count={totalRows || 0}
        page={currentPage}
        rowsPerPage={25}
        rowsPerPageOptions={[]}
        onPageChange={(event: unknown, newPage: number) =>
          onChangePage(newPage)
        }
      />
    </>
  );
};

export default AMMPoolHistoryTable;
