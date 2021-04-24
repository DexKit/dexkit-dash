import React, {useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import GridContainer from '../../../../@crema/core/GridContainer';
import Box from '@material-ui/core/Box';
import TokenInfo from './TokenInfo';
import TokenStatistics from './TokenStatistics';

import {  Paper, Typography, Link, Breadcrumbs } from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';
import { TokenSearch } from 'shared/components/TokenSearch';
import { truncateAddress } from 'utils';
import TokenOrders from './TokenOrders';
import { TokenSearchByList } from 'shared/components/TokenSearchByList';
import TokenPairs from './TokenPairs';
import ZRXProtocolTokenPairs from 'modules/protocol-explorer/0x copy/token-pairs';
import { useWeb3 } from 'hooks/useWeb3';
import { getTokenInfo } from 'services/graphql/bitquery';
import { GET_NETWORK_NAME } from 'shared/constants/Bitquery';
import { Token } from 'types/app';

type TokenParams = {
  address: string;
};

type TokenProps = RouteComponentProps<TokenParams>

const TokenExplorer: React.FC<TokenProps> = (props) => {
  const { match: { params } } = props;
  const { address } = params;
  const [tokenInfo, setTokenInfo] = useState<Token>();
  const {chainId} = useWeb3();

  useEffect(() => {
    setTokenInfo(undefined);
    getTokenInfo(GET_NETWORK_NAME(chainId), address)
      .then(data => setTokenInfo(data))
      .catch(e => console.log(e))
  }, [address]);

  const getTokenInformation = () => {
   if(tokenInfo){
     return `- ${tokenInfo.name}`;
   }
  }

  return (
    <>
      {true ? (
        <Box pt={{xl: 4}}>
          <GridContainer>
            <Grid item xs={12} md={12}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" href="/protocol-explorer/0x-protocol/overview">Protocol Explorer</Link>
                <Link color="inherit" href="/protocol-explorer/0x-protocol/overview">ZRX Protocol</Link>
                <Typography color="textPrimary">Token Explorer</Typography>
                <Typography color="textPrimary">{truncateAddress(address)}</Typography>
              </Breadcrumbs>
              <Typography variant="h4"  color="textPrimary">ZRX Protocol Token Explorer {getTokenInformation()}</Typography>
            </Grid>

            <Grid item xs={12} md={12}>
              <Paper style={{padding: 10}}>
                <TokenSearchByList url={'/protocol-explorer/0x-protocol/token-explorer'} />
              </Paper>
            </Grid>
            {/*<Grid item xs={12} md={6}>
              <TokenInfo address={address} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TokenStatistics address={address} />
            </Grid> */}

            <Grid item xs={12} sm={12} md={12}>
              <TokenPairs address={address} />
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <TokenOrders address={address} />
            </Grid>

          </GridContainer>
        </Box>
      ) : null}
    </>
  );
};

export default TokenExplorer;


