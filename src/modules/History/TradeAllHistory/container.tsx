import React from 'react';
import {Grid, Box, Paper, Toolbar, Typography} from '@material-ui/core';
import {GridContainer} from '@crema';

import {useStyles} from './index.style';
import ErrorView from 'modules/Common/ErrorView';
import OrderTable from './OrderTable';
import LoadingTable from 'modules/Common/LoadingTable';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import {useIntl} from 'react-intl';

import {EthereumNetwork} from 'shared/constants/AppEnums';
import {useAllTradeHistory} from 'hooks/history/useAllTradeHistory';

type Props = {
  address: string;
  networkName: EthereumNetwork;
};

const TradeAllHistoryContainer: React.FC<Props> = (props) => {
  const {address, networkName} = props;
  const {messages} = useIntl();
  const classes = useStyles();

  const {
    loading,
    error,
    data,
    totalRows,
    currentPage,
    rowsPerPage,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  } = useAllTradeHistory({address, networkName});

  return (
    <GridContainer>
      <Grid item xs={12} md={12}>
        {loading ? (
          <LoadingTable columns={8} rows={10} />
        ) : error ? (
          <ErrorView message={error.message} />
        ) : (
          <OrderTable
            networkName={networkName}
            data={data}
            totalRows={totalRows}
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

export default TradeAllHistoryContainer;
