import React from 'react';
import {useIntl} from 'react-intl';
import {useAMMPairTrades} from 'hooks/protocolExplorer/useAMMPairTrades';
import {EthereumNetwork, EXCHANGE} from 'shared/constants/AppEnums';
import {Box, Hidden, Typography} from '@material-ui/core';
import AMMTradeHistoryTable from './AMMTradeHistoryTable';
import ErrorView from 'modules/Common/ErrorView';
import FilterList from 'shared/components/Filter/list';
import FilterMenu from 'shared/components/Filter/menu';
import LoadingTable from 'modules/Common/LoadingTable';
import IntlMessages from '../../../../@crema/utility/IntlMessages';

interface Props {
  networkName: EthereumNetwork;
  exchange: EXCHANGE;
  address: string;
}

const AMMTradeHistory: React.FC<Props> = (props: Props) => {
  const {networkName, exchange, address} = props;
  const {messages} = useIntl();

  const {
    loading,
    error,
    data,
    currentPage,
    rowsPerPage,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  } = useAMMPairTrades({networkName, exchange, address});

  return (
    <>
      <Box
        py={4}
        display='flex'
        justifyContent='space-between'
        alignItems='center'>
        <Box
          display={'flex'}
          justifyContent={'flex-start'}
          alignItems={'center'}>
          <Typography variant='h6' display={'block'} align={'center'}>
            <IntlMessages id='app.protocolExplorer.tradeHistory' />
          </Typography>
        </Box>
        <Hidden mdDown>
          <Box
            display={'flex'}
            justifyContent={'flex-end'}
            alignItems={'center'}>
            <FilterList />
            <FilterMenu />
          </Box>
        </Hidden>
      </Box>

      {loading ? (
        <LoadingTable columns={7} rows={10} />
      ) : error ? (
        <ErrorView message={error.message} />
      ) : (
        <AMMTradeHistoryTable
          networkName={networkName}
          data={data}
          exchange={exchange}
          totalRows={100}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
          onChangePage={(newPage) => onChangePage(newPage)}
          onChangeRowsPerPage={(perPage) => onChangeRowsPerPage(perPage)}
        />
      )}
    </>
  );
};

export default AMMTradeHistory;
