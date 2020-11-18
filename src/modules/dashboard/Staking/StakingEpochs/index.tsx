import React, { useState } from 'react';
import { Box, Grid, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, TableSortLabel } from '@material-ui/core';

import GridContainer from '../../../../@crema/core/GridContainer';
import InfoView from '../../../../@crema/core/InfoView';

import { Loader } from '@crema';
import AppCard from '@crema/core/AppCard';
import AppSelect from '@crema/core/AppSelect';
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
  { id: 'epoch', label: 'Epoch', isSort: false },
  { id: 'totalEthToClaim', align: 'left', label: 'Total ETH', isSort: true },
  { id: 'totalClaimed', align: 'left', label: 'Total Supply Claimed', isSort: true },
  { id: 'myClaim', align: 'left', label: 'My Claim', isSort: true },
  { id: 'actions', align: 'left', label: 'Actions', isSort: false },
];

interface StakingData{
  epoch: number;
  totalEthToClaim: number;
  totalClaimed: number;
  myClaim: number;
}

const data: StakingData[] = [
  {
    epoch: 1,
    totalEthToClaim: 10,
    totalClaimed: 10000,
    myClaim: 1,
  },
  {
    epoch: 2,
    totalEthToClaim: 10,
    totalClaimed: 1000,
    myClaim: 3,
  }
]

const UniswapPairs = () => {
  const [page, setPage] = useState<number>(0);
  const [orderBy, setOrderBy] = useState<string>('dailyVolumeUSD');
  const [orderDirection, setOrderDirection] = useState<Order>('desc');
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const handleSelectionType = (data: any) => {
    console.log('data: ', data);
  };
  const loading = false;
  const error = false;


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
                      {stableSort(data, getComparator(orderDirection, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((data) => (
                          <TableRow key={data.epoch}>
                            <TableCell component='th' scope='row' className={classes.tableCell} style={{ overflow: "hidden", textOverflow: "ellipsis", width: '11rem' }}>
                              <Box className={classes.anchar}>
                                {data.epoch}
                              
                              </Box>
                            </TableCell>
                            <TableCell align='left' className={classes.tableCell}>
                              ${new BigNumber(data.totalEthToClaim).toFormat(4)}
                            </TableCell>
                            <TableCell
                              align='left'
                              className={classes.tableCell}>
                              ${new BigNumber(data.totalClaimed).toFormat(4)}
                            </TableCell>
                            <TableCell align='left' className={classes.tableCell}>
                              <Box
                                className={classes.badgeRoot}>
                                {new BigNumber(data.myClaim).toFormat(0)}
                              </Box>
                            </TableCell>
                            <TableCell align='left' className={classes.tableCell}>
                              <Box
                                className={classes.badgeRoot}>
                               Here goes buttons
                              </Box>
                            </TableCell>
                          </TableRow>))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={data.length}
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
