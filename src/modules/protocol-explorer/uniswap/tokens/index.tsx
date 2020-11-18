import React, { useState } from 'react';
import { Box, Grid, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, TableSortLabel } from '@material-ui/core';

import GridContainer from '../../../../@crema/core/GridContainer';
import InfoView from '../../../../@crema/core/InfoView';

import { useQuery } from '@apollo/client';
import { TokenDayDataGraphResponse } from 'types/uniswap';
import { UNISWAP_TOKENS_DAY_DATA } from 'services/graphql/uniswap/gql';
import { Loader } from '@crema';
import AppCard from '@crema/core/AppCard';
import { useIntl } from 'react-intl';
import { BigNumber } from '@0x/utils';
import { useStyles } from './index.style';

import { stableSort, getComparator } from 'utils/table';

type Order = 'asc' | 'desc';

interface HeadCell {
  id: string;
  label: string;
  align?: 'left' | 'right';
  isSort: boolean;
}

const headCells: HeadCell[] = [
  { id: 'name', label: 'Name', isSort: false },
  { id: 'symbol', align: 'left', label: 'Symbol', isSort: false },
  { id: 'totalLiquidityUSD', align: 'left', label: 'Liquidity', isSort: true },
  { id: 'dailyVolumeUSD', align: 'left', label: 'Volume (24hrs)', isSort: true },
  { id: 'priceUSD', align: 'left', label: 'Price', isSort: true },
];
let lastDayTimestamp = Math.floor(Date.now() / 1000) - 86400;

const UniswapTokens = () => {
  const [page, setPage] = useState<number>(0);
  const [orderBy, setOrderBy] = useState<string>('totalLiquidityUSD');
  const [orderDirection, setOrderDirection] = useState<Order>('desc');
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const getLastDayTimestamp = () => {
    if(lastDayTimestamp < Math.floor(Date.now() / 1000) - 2*86400 ){
      lastDayTimestamp = Math.floor(Date.now() / 1000) - 86400
    }
    return lastDayTimestamp;

  }

  const { loading, error, data } = useQuery<{ tokenDayDatas: TokenDayDataGraphResponse[] }>(UNISWAP_TOKENS_DAY_DATA, {
    variables: {first: 200, skip: 0, timestamp: getLastDayTimestamp(), orderBy: orderBy, orderDirection: orderDirection }
  });
  
  const { messages } = useIntl();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleSort = (property: string) => (event: React.MouseEvent<unknown>) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
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
                title={messages['common.tokens']}
               >
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
                      {stableSort(data.tokenDayDatas, getComparator(orderDirection, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((data) => (
                          <TableRow key={data.token.id}>
                            <TableCell component='th' scope='row' className={classes.tableCell} style={{ overflow: "hidden", textOverflow: "ellipsis", width: '11rem' }}>
                              <Box className={classes.anchar}>{data.token.name}</Box>
                            </TableCell>
                            <TableCell align='left' className={classes.tableCell} style={{ overflow: "hidden", textOverflow: "ellipsis", width: '11rem' }}>
                              {data.token.symbol}
                            </TableCell>
                            <TableCell align='left' className={classes.tableCell}>
                              ${new BigNumber(data.totalLiquidityUSD).toFormat(4)}
                            </TableCell>
                            <TableCell
                              align='left'
                              className={classes.tableCell}>
                              ${new BigNumber(data.dailyVolumeUSD).toFormat(4)}
                            </TableCell>
                            <TableCell align='left' className={classes.tableCell}>
                              <Box
                                className={classes.badgeRoot}>
                                ${new BigNumber(data.priceUSD).toFormat(4)}
                              </Box>
                            </TableCell>
                          </TableRow>))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={data.tokenDayDatas.length}
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

export default UniswapTokens;
