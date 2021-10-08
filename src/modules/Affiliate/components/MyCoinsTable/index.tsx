import React, {useState, useCallback} from 'react';

import {GridContainer} from '@crema';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import FilterIcon from '@material-ui/icons/FilterList';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import {makeStyles} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import {Search} from '@material-ui/icons';
import ContainedInput from 'shared/components/ContainedInput';

const useStyles = makeStyles(() => ({
  tableCell: {
    borderBottom: '1px solid #525C75',
    color: 'white',
    backgroundColor: 'transparent',
  },
  tableHead: {
    color: 'white',
  },
  filterBtn: {
    color: 'white',
    borderRadius: 5,
    backgroundColor: '#252836',
  },
}));

interface Props {
  coins?: any[];
}

function MyCoinsTable(props: Props) {
  const classes = useStyles();

  const [search, setSearch] = useState('');

  const handleChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  return (
    <GridContainer>
      <Grid item xs={12}>
        <Grid container spacing={8}>
          <Grid item md={4} xs={12}>
            <ContainedInput
              value={search}
              fullWidth
              onChange={handleChange}
              startAdornment={
                <InputAdornment position='start'>
                  <Search />
                </InputAdornment>
              }
              placeholder='Search'
            />
          </Grid>
          <Grid item md={7} xs={11}>
            <Typography variant='h5'>
              {props.coins?.length || 0} coins
            </Typography>
            <Typography variant='h6'>Highest Cap &darr;</Typography>
          </Grid>
          <Grid item md={1} xs={1}>
            <IconButton className={classes.filterBtn}>
              <FilterIcon fontSize='large' />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <TableContainer>
          <Table>
            <TableHead className={classes.tableHead}>
              <TableRow>
                <TableCell className={classes.tableCell}>Buy Amount</TableCell>
                <TableCell className={classes.tableCell}>Buy Amount</TableCell>
                <TableCell className={classes.tableCell}>Buy Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(props.coins || [{}, {}]).map((affilate, i) => (
                <TableRow key={i}>
                  <TableCell className={classes.tableCell}>$ 120,00</TableCell>
                  <TableCell className={classes.tableCell}>$ 120,00</TableCell>
                  <TableCell className={classes.tableCell}>$ 120,00</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </GridContainer>
  );
}

export default MyCoinsTable;
