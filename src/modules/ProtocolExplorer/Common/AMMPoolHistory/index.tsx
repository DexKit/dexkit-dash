import React from 'react';
import {useIntl} from 'react-intl';
// import {MintBurn} from 'types/app';
import {useAMMPoolHistory} from 'hooks/protocolExplorer/useAMMPoolHistory';
import {EXCHANGE, EthereumNetwork} from 'shared/constants/AppEnums';
import {Box, Toolbar, Typography} from '@material-ui/core';
import ErrorView from 'modules/Common/ErrorView';
import AMMPoolHistoryTable from './AMMPoolHistoryTable';
import {useStyles} from './index.style';
import {
  GetAMMPairExplorer_ethereum_dexTrades_baseCurrency,
  GetAMMPairExplorer_ethereum_dexTrades_quoteCurrency,
} from 'services/graphql/bitquery/protocol/__generated__/GetAMMPairExplorer';
import LoadingTable from 'modules/Common/LoadingTable';

interface Props {
  networkName: EthereumNetwork;
  exchange: EXCHANGE;
  address: string;
  baseCurrency: GetAMMPairExplorer_ethereum_dexTrades_baseCurrency;
  quoteCurrency: GetAMMPairExplorer_ethereum_dexTrades_quoteCurrency;
}

const AMMPoolHistory: React.FC<Props> = (props: Props) => {
  const {networkName, exchange, address, baseCurrency, quoteCurrency} = props;
  const {messages} = useIntl();
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
  } = useAMMPoolHistory({
    networkName,
    exchange,
    address,
    baseCurrency,
    quoteCurrency,
  });

  return (
    <>
      <Toolbar className={classes.toolbar}>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          style={{width: '100%'}}>
          <Box
            display={'flex'}
            justifyContent={'flex-start'}
            alignItems={'center'}>
            <Typography variant='h6' display={'block'} align={'center'}>
              {messages['app.pool']}
            </Typography>
          </Box>
        </Box>
      </Toolbar>
      {loading ? (
        <LoadingTable columns={7} rows={10} />
      ) : error ? (
        <ErrorView message={error.message} />
      ) : (
        <AMMPoolHistoryTable
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

export default AMMPoolHistory;
