import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useNetwork } from 'hooks/useNetwork';
import { useTransactionInfo } from 'hooks/history/useTransactionInfo';
import { Box } from '@material-ui/core';
import { truncateAddress } from 'utils';
import { useStyles } from './index.style';

import PageTitle from 'shared/components/PageTitle';
import LoadingView from 'modules/Common/LoadingView';
import ErrorView from 'modules/Common/ErrorView';

type Params = {
  hash: string
};

type Props = RouteComponentProps<Params>

const TransactionView: React.FC<Props> = (props) => { 
  const {match: { params }} = props;
  const {hash} = params;

  const networkName = useNetwork();
  const { loading, error, data } = useTransactionInfo({hash});

  const classes = useStyles();

  return (
    <Box pt={{xl: 4}}>

      <PageTitle
        breadcrumbs={{
          history: [
            {url:'/', name: 'Dashboard'},
            {url:'/dashboard/wallet', name: 'Wallet'}
          ],
          active: {name: 'Transaction View'}
        }}
        title={{name: 'Transaction View'}}
        subtitle={{name: truncateAddress(hash), hasCopy: hash}}
      />

      {
        loading ? ( <LoadingView /> ) : error ? ( <ErrorView message={error.message} /> ) : (
          <Box>
            {
              data?.ethereum?.transactions?.map(e => (
                <Box key={e.hash}>
                  <Box className={classes.row}>
                    <Box>Transaction Hash:</Box>
                    <Box>{e.hash}</Box>
                  </Box>
                  <Box className={classes.row}>
                    <Box>Status:</Box>
                    <Box>{e.success} icone de sucesso</Box>
                  </Box>
                  <Box className={classes.row}>
                    <Box>Block:</Box>
                    <Box>{e.block?.height}</Box>
                  </Box>
                  <Box className={classes.row}>
                    <Box>Timestamp:</Box>
                    <Box>{e.block?.timestamp?.unixtime}</Box>
                  </Box>
                  <Box className={classes.row}>
                    <Box>From:</Box>
                    <Box>{e.sender?.address}</Box>
                  </Box>
                  <Box className={classes.row}>
                    <Box>To:</Box>
                    <Box>{e.to?.address}</Box>
                  </Box>
                  <Box className={classes.row}>
                    <Box>Value:</Box>
                    <Box>{e.amount?.toFixed(8)} {e.currency?.name}</Box>
                  </Box>
                  <Box className={classes.row}>
                    <Box>Transaction Fee:</Box>
                    <Box>{e.gasValue?.toFixed(8)} {e.gasCurrency?.name}</Box>
                  </Box>
                  <Box className={classes.row}>
                    <Box>Gass Price:</Box>
                    <Box>{e.gasPrice?.toFixed(8)} {e.gasCurrency?.name}</Box>
                  </Box>
                  <Box className={classes.row}>
                    <Box>Gas Used by Transaction:</Box>
                    <Box>{e.gas}</Box>
                  </Box>
                  <Box className={classes.row}>
                    <Box>Nonce:</Box>
                    <Box>{e.nonce} - {e.index}</Box>
                  </Box>
                </Box>
              ))
            }
          </Box>
        )
      }
    </Box>
  );
};

export default TransactionView;
