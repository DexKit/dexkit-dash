import React from 'react';
import {useIntl} from 'react-intl';
import {useTokenPairs} from 'hooks/protocolExplorer/useTokenPairs';
import {EthereumNetwork, EXCHANGE} from 'shared/constants/AppEnums';

import {Box, Paper, Toolbar, Typography} from '@material-ui/core';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import LoadingView from 'modules/Common/LoadingView';
import ErrorView from 'modules/Common/ErrorView';
import TokenPairsTable from './TokenPairsTable';
import {useStyles} from './index.style';

interface Props {
  baseAddress: string;
  exchange: EXCHANGE;
  networkName: EthereumNetwork;
}

const TokenPairs: React.FC<Props> = (props) => {
  const {baseAddress, exchange, networkName} = props;
  // const {chainId} = useWeb3();
  const {messages} = useIntl();
  // const [tableData, setTableData] = useState<TokenPair[]>([]);
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
  } = useTokenPairs({exchange, baseAddress});

  // useEffect(() => {
  //   setTableData([]);
  //   getTokenPairs(GET_NETWORK_NAME(chainId), exchange, baseAddress)
  //     .then((orders) => setTableData(orders))
  //     .catch((e) => console.log(e));
  // }, [address]);

  return (
    <Paper className={classes.paper}>
      <Toolbar className={classes.toolbar}>
        <Box display={'flex'} justifyContent={'flex-start'}  alignItems={'center'}>
          <EmojiEventsIcon color={'primary'} className={classes.toolbarIcon}/>
          <Typography variant='h5' display={'block'}  align={'center'}>{messages['app.topPairs']}</Typography>
        </Box>
      </Toolbar>
      {loading ? ( <LoadingView /> ) : error ? ( <ErrorView message={error.message} /> ) : (
        <TokenPairsTable
          networkName={networkName}
          data={data}
          exchange={exchange}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
          onChangePage={(newPage) => onChangePage(newPage)}
          onChangeRowsPerPage={(perPage) => onChangeRowsPerPage(perPage)}
        />
      )}
    </Paper>
  );
};

export default TokenPairs;
