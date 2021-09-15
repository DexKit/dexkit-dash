import React from 'react';
import {useIntl} from 'react-intl';
import {useTokenTrades} from 'hooks/protocolExplorer/useTokenTrades';
import {
  Box,
  CircularProgress,
  Hidden,
  Toolbar,
  Tooltip,
  Typography,
} from '@material-ui/core';
import {EXCHANGE, EthereumNetwork} from 'shared/constants/AppEnums';
import FilterMenu from 'shared/components/Filter/menu';
import FilterList from 'shared/components/Filter/list';
import ErrorView from 'modules/Common/ErrorView';
import TokenOrdersTable from './TokenOrdersTable';
import {useStyles} from './index.style';
import LoadingTable from 'modules/Common/LoadingTable';

interface Props {
  baseAddress: string | null;
  quoteAddress: string | null;
  exchange: EXCHANGE;
  networkName: EthereumNetwork;
  type: 'pair' | 'token';
}

const TokenOrders: React.FC<Props> = (props) => {
  const {baseAddress, quoteAddress, exchange, networkName, type} = props;
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
    nextRefresh,
    seconds,
  } = useTokenTrades({baseAddress, quoteAddress, exchange, networkName});

  return (
    <Box>
      <Toolbar className={classes.toolbar}>
        <Box
          display={'flex'}
          justifyContent={'flex-start'}
          alignItems={'center'}>
          <Typography variant='h5' display={'block'} align={'center'}>
            {messages['app.tradeHistory']}
          </Typography>
        </Box>
        <Hidden mdDown>
          <Box
            display={'flex'}
            justifyContent={'flex-end'}
            alignItems={'center'}>
            <FilterList />
            <FilterMenu />
            <Tooltip title={`Last update ${seconds} s `}>
              <CircularProgress
                size={20}
                variant='determinate'
                value={nextRefresh}
              />
            </Tooltip>
          </Box>
        </Hidden>
      </Toolbar>

      {loading ? (
        <LoadingTable columns={8} rows={10} />
      ) : error ? (
        <ErrorView message={error.message} />
      ) : (
        <TokenOrdersTable
          networkName={networkName}
          data={data}
          exchange={exchange}
          type={type}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
          onChangePage={(newPage) => onChangePage(newPage)}
          onChangeRowsPerPage={(perPage) => onChangeRowsPerPage(perPage)}
        />
      )}
    </Box>
    // </AppCard>
    //
  );
};

export default TokenOrders;
