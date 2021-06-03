import React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {Grid, Box, Paper, Toolbar, Typography} from '@material-ui/core';
import {GridContainer} from '@crema';
import {useTransactionList} from 'hooks/history/useTransactionList';
import {useStyles} from './index.style';
import ErrorView from 'modules/Common/ErrorView';
import TransactionTable from './TransactionTable';
import {useNetwork} from 'hooks/useNetwork';
import LoadingTable from 'modules/Common/LoadingTable';
import PageTitle from 'shared/components/PageTitle';

type Params = {
  address: string;
};

type Props = RouteComponentProps<Params>;

const TransactionList: React.FC<Props> = (props) => {
  const {
    match: {params},
  } = props;
  const {address} = params;

  const classes = useStyles();

  const networkName = useNetwork();
  const {
    loading,
    error,
    data,
    currentPage,
    rowsPerPage,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  } = useTransactionList({address});

  return (
    <Box pt={{xl: 4}}>

      <PageTitle
        breadcrumbs={{
          history: [
            {url:'/', name: 'Dashboard'},
            {url: '/ethereum/dashboard/wallet', name: 'Wallet'}
          ],
          active: {name: 'Transaction History'}
        }}
        title={{name: 'Transaction History'}}
      />

      <GridContainer>
        <Grid item xs={12} md={12}>
          <Paper className={classes.paper}>
            <Toolbar className={classes.toolbar}>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                style={{width: '100%'}}>
                <Box>
                  <Typography variant='h5'>Transaction List</Typography>
                </Box>
                {/* <Select
                    className={classes.selectBox}
                    value={filterValue}
                    onChange={handleChange}
                    disableUnderline={true}>
                    <option value='all' className={classes.selectOption}>
                      {messages['app.all']}
                    </option>
                    <option value='send' className={classes.selectOption}>
                      {messages['app.send']}
                    </option>
                    <option value='receive' className={classes.selectOption}>
                      {messages['app.receive']}
                    </option>
                  </Select> */}
              </Box>
            </Toolbar>
            {loading ? (
              <LoadingTable columns={6} rows={10} />
            ) : error ? (
              <ErrorView message={error.message} />
            ) : (
              <TransactionTable
                networkName={networkName}
                data={data}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={rowsPerPageOptions}
                onChangePage={(newPage) => onChangePage(newPage)}
                onChangeRowsPerPage={(perPage) => onChangeRowsPerPage(perPage)}
              />
            )}
          </Paper>
        </Grid>
      </GridContainer>
    </Box>
  );
};

export default TransactionList;
