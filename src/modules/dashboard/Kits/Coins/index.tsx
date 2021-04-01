import React, { useState } from 'react';
import { Box, Grid, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, TableSortLabel } from '@material-ui/core';

import GridContainer from '../../../../@crema/core/GridContainer';
import InfoView from '../../../../@crema/core/InfoView';

// import { useQuery } from '@apollo/client';
// import { PairDayDataGraphResponse } from 'types/uniswap';

import { Loader } from '@crema';
import AppCard from '@crema/core/AppCard';
import AppSelect from '@crema/core/AppSelect';
import { useIntl } from 'react-intl';
import { BigNumber } from '@0x/utils';
import { useStyles } from './index.style';

// import { UNISWAP_PAIRS_DAY_DATA } from 'services/graphql/uniswap/gql';
import { stableSort, getComparator } from 'utils/table';
import { MOCK_UNISWAP_PAIRS_DAY_DATA } from 'services/graphql/uniswap/mocks';

type Order = 'asc' | 'desc';

interface HeadCell {
  id: string;
  label: string;
  align?: 'left' | 'right';
  isSort: boolean;
}

const headCells: HeadCell[] = [
  { id: 'name', label: 'Name', isSort: false },
  { id: 'reserveUSD', align: 'left', label: 'Liquidity', isSort: true },
  { id: 'dailyVolumeUSD', align: 'left', label: 'Volume (24hrs)', isSort: true },
  { id: 'dailyTxns', align: 'left', label: 'Total Tx\'s', isSort: true },
];

// let lastDayTimestamp = Math.floor(Date.now() / 1000) - 86400;
const UniswapPairs = () => {
  const [page, setPage] = useState<number>(0);
  const [orderBy, setOrderBy] = useState<string>('dailyVolumeUSD');
  const [orderDirection, setOrderDirection] = useState<Order>('desc');
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const handleSelectionType = (data: any) => {
    console.log('data: ', data);
  };

  // const getLastDayTimestamp = () => {
  //   if(lastDayTimestamp < Math.floor(Date.now() / 1000) - 2*86400 ){
  //     lastDayTimestamp = Math.floor(Date.now() / 1000) - 86400
  //   }
  //   return lastDayTimestamp;
  // }

  // const { loading, error, data } = useQuery<{ pairDayDatas: PairDayDataGraphResponse[] }>(UNISWAP_PAIRS_DAY_DATA, {
  //   variables: {first: 100, skip: 0, timestamp: getLastDayTimestamp(), orderBy: orderBy, orderDirection: orderDirection }
  // });
  const{ error, loading, data } = MOCK_UNISWAP_PAIRS_DAY_DATA;
  const { messages } = useIntl();

  console.log('data', data);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleSort = (property: string) => (event: React.MouseEvent<unknown>) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    console.log('orderBy', property);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const classes = useStyles();

  return (
    <>
      {data ? (
        <Box pt={{ xl: 4 }} clone>
          <GridContainer>
            <Grid item xs={11} md={11}>
              <AppCard
                height={1}
                title={messages['common.pairs']}
                action={
                  <AppSelect
                    menus={[
                      messages['dashboard.thisWeek'],
                      messages['dashboard.lastWeeks'],
                      messages['dashboard.lastMonth'],
                    ]}
                    defaultValue={messages['dashboard.thisWeek']}
                    onChange={handleSelectionType}
                  />
                }>
                <Box className={classes.tableResponsiveMaterial}>
                  <Table className='table'>
                    <TableHead>
                      <TableRow className={classes.tableRowRoot}>
                        {headCells.map(h => (
                          <TableCell align={h.align} className={classes.tableCellRoot}>
                            {h.isSort && <TableSortLabel
                              active={orderBy === h.id}
                              direction={orderBy === h.id ? orderDirection : 'asc'}
                              onClick={handleSort(h.id)}
                            >
                              {h.label}
                            </TableSortLabel>}
                            {!h.isSort && h.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        stableSort(data.pairDayDatas, getComparator(orderDirection, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map(
                          (data) => (
                            <TableRow key={data.id}>
                              <TableCell component='th' scope='row' className={classes.tableCell} style={{ overflow: "hidden", textOverflow: "ellipsis", width: '11rem' }}>
                                <Box className={classes.anchar}>
                                  {`${data.token0.symbol}/${data.token1.symbol}`}
                                
                                </Box>
                              </TableCell>
                              <TableCell align='left' className={classes.tableCell}>
                                ${new BigNumber(data.reserveUSD).toFormat(4)}
                              </TableCell>
                              <TableCell
                                align='left'
                                className={classes.tableCell}>
                                ${new BigNumber(data.dailyVolumeUSD).toFormat(4)}
                              </TableCell>
                              <TableCell align='left' className={classes.tableCell}>
                                <Box
                                  className={classes.badgeRoot}>
                                  {new BigNumber(data.dailyTxns).toFormat(0)}
                                </Box>
                              </TableCell>
                            </TableRow>
                          )
                        )
                      }
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={data.pairDayDatas.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </Box>
              </AppCard>
            </Grid>

          </GridContainer>
        </Box>
      ) : null}
      {loading ? <Loader /> : null}
      {error ? JSON.stringify(error) : null}

      <InfoView />
    </>
  );
};

export default UniswapPairs;
