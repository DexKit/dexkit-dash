import React, {useRef, useState, useCallback} from 'react';

import {
  Box,
  Grid,
  Typography,
  IconButton,
  Breadcrumbs,
  Link,
} from '@material-ui/core';

import {Alert} from '@material-ui/lab';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import {Link as RouterLink, useHistory} from 'react-router-dom';
import IntlMessages from '@crema/utility/IntlMessages';

import {NFTEmptyStateImage} from 'shared/components/Icons';

import {useWeb3} from 'hooks/useWeb3';
import ChampionCard from 'modules/CoinLeagues/components/champions/ChampionCard';
import {useMyChampions} from 'modules/CoinLeagues/hooks/champions';

export const ChampionsIndex = () => {
  const history = useHistory();
  const {chainId} = useWeb3();

  const emtpyArrayRef = useRef(new Array(8).fill(null));

  const [errorMessage, setErrorMessage] = useState<string>();

  const myChampions = useMyChampions(chainId);

  const handleClearError = useCallback(() => {
    setErrorMessage(undefined);
  }, []);

  const onClickBack = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <>
      <Box>
        <Box mb={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Breadcrumbs>
                <Link color='inherit' component={RouterLink} to='/'>
                  <IntlMessages id='nfts.walletBreadcrumbDashboard' />
                </Link>
              </Breadcrumbs>
            </Grid>
            <Grid item xs={12}>
              <Box display='flex' alignItems='center' alignContent='center'>
                <Box
                  display='flex'
                  alignItems='center'
                  alignContent='center'
                  mr={2}>
                  <IconButton size='small' onClick={onClickBack}>
                    <ArrowBackIcon />
                  </IconButton>
                </Box>
                <Typography variant='h5'>My Champions</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Grid container spacing={4}>
          {errorMessage && (
            <Grid item xs={12}>
              <Alert severity='error' onClose={handleClearError}>
                {errorMessage}
              </Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                {myChampions.loading ? (
                  <Grid container spacing={4}>
                    {emtpyArrayRef.current.map((i, index) => (
                      <Grid item xs={12} sm={3} key={index}>
                        <ChampionCard loading />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <>
                    {myChampions.data?.length === 0 && (
                      <Box py={4}>
                        <Grid container spacing={4}>
                          <Grid item xs={12}>
                            <Box
                              display='flex'
                              justifyContent='center'
                              alignContent='center'
                              alignItems='center'>
                              <NFTEmptyStateImage />
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography align='center' variant='h5'>
                              <IntlMessages id='nfts.wallet.noItemsFound' />
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                    <Grid container spacing={4}>
                      {myChampions.data?.map((champion, index: number) => (
                        <Grid item xs={12} sm={3} key={index}>
                          <ChampionCard champion={champion} />
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ChampionsIndex;
