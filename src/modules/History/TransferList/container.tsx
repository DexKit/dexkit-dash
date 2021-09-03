import React from 'react';
import {Grid, Box, Paper, Toolbar, Typography} from '@material-ui/core';
import {GridContainer} from '@crema';
import {useStyles} from './index.style';
import ErrorView from 'modules/Common/ErrorView';
import TransferTable from './TransferTable';
import LoadingTable from 'modules/Common/LoadingTable';

import {EthereumNetwork} from 'shared/constants/AppEnums';
import {useTransferList} from 'hooks/history/useTransferList';

type Props = {
  address: string;
  networkName: EthereumNetwork;
};

const TransferListContainer: React.FC<Props> = (props) => {
  const {address, networkName} = props;
  const classes = useStyles();
  const {
    loading,
    error,
    data,
    currentPage,
    rowsPerPage,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  } = useTransferList({address, networkName});

  return (
    <GridContainer>
      <Grid item xs={12}>
        {loading ? (
          <LoadingTable columns={6} rows={10} />
        ) : error ? (
          <ErrorView message={error.message} />
        ) : (
          <TransferTable
            networkName={networkName}
            data={data}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
            onChangePage={(newPage) => onChangePage(newPage)}
            onChangeRowsPerPage={(perPage) => onChangeRowsPerPage(perPage)}
          />
        )}
      </Grid>
    </GridContainer>
  );
};

export default TransferListContainer;
