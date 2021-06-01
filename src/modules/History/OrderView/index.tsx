import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useNetwork } from 'hooks/useNetwork';
import { useOrderInfo } from 'hooks/history/useOrderInfo';
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

const OrderView: React.FC<Props> = (props) => { 
  const {match: { params }} = props;
  const {hash} = params;

  const networkName = useNetwork();
  const { loading, error, data } = useOrderInfo({hash});

  const classes = useStyles();

  return (
    <Box pt={{xl: 4}}>

      {/* <PageTitle
        history={[
          { url:'', name: networkName}
        ]}
        active={'Order'}
        title={`Order ${truncateAddress(hash)}`}
      /> */}

      {
        loading ? ( <LoadingView /> ) : error ? ( <ErrorView message={error.message} /> ) : (
          <Box>
            {
              data?.ethereum?.dexTrades?.map(e => (
                <>
                  <Box className={classes.row}>
                    <Box>Transaction Hash:</Box>
                    <Box>{e.block?.hash}</Box>
                  </Box>
                  <Box className={classes.row}>
                    <Box>Status:</Box>
                    <Box>icone de sucesso</Box>
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
                    <Box>{e.taker?.address}</Box>
                  </Box>
                  <Box className={classes.row}>
                    <Box>To:</Box>
                    <Box>{e.maker?.address}</Box>
                  </Box>
                  <Box className={classes.row}>
                    <Box>Value:</Box>
                    <Box>{e.tradeAmountInUsd}</Box>
                  </Box>
                  <Box className={classes.row}>
                    <Box>Transaction Fee:</Box>
                    <Box>{e.transaction?.gasValue?.toFixed(8)}</Box>
                  </Box>
                  <Box className={classes.row}>
                    <Box>Gass Price:</Box>
                    <Box>{e.transaction?.gasPrice?.toFixed(8)}</Box>
                  </Box>
                  <Box className={classes.row}>
                    <Box>Gas Used by Transaction:</Box>
                    <Box>{e.transaction?.gas}</Box>
                  </Box>
                  <Box className={classes.row}>
                    <Box>Nonce:</Box>
                    <Box>{e.transaction?.nonce} - {e.transaction?.index}</Box>
                  </Box>
                </>
              ))
            }
          </Box>
        )
      }
    </Box>
  );
};

export default OrderView;
