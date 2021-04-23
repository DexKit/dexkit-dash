import React, { useState } from 'react';
import { Box, Grid, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, TableSortLabel } from '@material-ui/core';

import { Loader, GridContainer, InfoView } from '@crema';
import AppCard from '@crema/core/AppCard';
import AppSelect from '@crema/core/AppSelect';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';

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
  { id: 'domain', align: 'left', label: 'Domain', isSort: true },
  { id: 'collectedFees', align: 'left', label: 'Collected Fees', isSort: true },
  { id: 'actions', align: 'left', label: 'Actions', isSort: false },
];

const data = [{
  id: 1,
  name: 'Project',
  domain: 'project.com',
  collectedFees: 200
}]


const AppsTable = () => {
  const [page, setPage] = useState<number>(0);
  const [orderBy, setOrderBy] = useState<string>('collectedFees');
  const [orderDirection, setOrderDirection] = useState<Order>('desc');
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const handleSelectionType = (data: any) => {
    console.log('data: ', data);
  };
  const loading = false;
  const error = false;

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
            <Grid item xs={12} md={12}>
              <AppCard
                height={1}
                title={'My Apps'}
                // action={
                //   <>
                //     <div>
                //       <IconButton aria-label="add">
                //         <AddIcon />
                //       </IconButton>

                //       <AppSelect
                //         menus={[
                //           'ALL',
                //           'Aggregators',
                //           'Exchanges',
                //           'NFT Marketplace',
                //         ]}
                //         defaultValue={'ALL'}
                //         onChange={handleSelectionType}
                //       />
                //     </div>
                //   </>
                // }
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
                      {stableSort(data, getComparator(orderDirection, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((data) => (
                          <TableRow key={data.id}>
                            <TableCell component='th' scope='row' className={classes.tableCell} style={{ overflow: "hidden", textOverflow: "ellipsis", width: '11rem' }}>
                              <Box className={classes.anchar}>
                                {data.name}

                              </Box>
                            </TableCell>
                            <TableCell align='left' className={classes.tableCell}>
                              {data.domain}
                            </TableCell>
                            <TableCell
                              align='left'
                              className={classes.tableCell}>
                              {data.collectedFees}
                            </TableCell>
                            <TableCell align='left' className={classes.tableCell}>
                              <Box
                                className={classes.badgeRoot}>

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
    </>
  );
};

export default AppsTable;
