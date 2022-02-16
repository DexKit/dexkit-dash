import IntlMessages from '@crema/utility/IntlMessages';
import {
  Breadcrumbs,
  Grid,
  IconButton,
  Typography,
  Link,
  Box,
  TextField,
  Button,
  Paper,
  InputAdornment,
} from '@material-ui/core';
import React, {useCallback, useRef, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import MainLayout from 'shared/components/layouts/main';

import {Link as RouterLink} from 'react-router-dom';
import {HOME_ROUTE} from 'shared/constants/routes';
import {useProfileGame} from 'modules/CoinLeagues/hooks/useGameProfile';
import {isAddress} from 'web3-utils';
import {reduceAddress} from 'modules/CoinLeagues/utils/game';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ChampionCard from 'modules/CoinLeagues/components/champions/ChampionCard';

import {NFTEmptyStateImage} from 'shared/components/Icons';
import {
  useChampionBalance,
  useMyChampions,
} from 'modules/CoinLeagues/hooks/champions';
import {useLeaguesChainInfo} from 'modules/CoinLeagues/hooks/useLeaguesChainInfo';
import {useDebounce} from 'hooks/useDebounce';

import SearchIcon from '@material-ui/icons/Search';
import {useIntl} from 'react-intl';
import {Skeleton} from '@material-ui/lab';

interface Props {}

export const ProfileCollection: React.FC<Props> = () => {
  const history = useHistory();
  const {chainId} = useLeaguesChainInfo();

  const {messages} = useIntl();

  const {address}: {address: string} = useParams();

  const championsBalance = useChampionBalance({chainId, account: address});

  const emtpyArrayRef = useRef(new Array(8).fill(null));

  const profileGame = useProfileGame(address);

  const handleGoClick = useCallback(() => {
    history.push(`/coin-league/profile/${address}`);
  }, [history, address]);

  const myChampions = useMyChampions({chainId, account: address});

  const [search, setSearch] = useState('');

  const handleChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const lazyName: string = useDebounce(search, 400);

  return (
    <MainLayout>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Breadcrumbs>
                <Link color='inherit' component={RouterLink} to={HOME_ROUTE}>
                  <IntlMessages id='app.coinLeagues.dashboard' />
                </Link>
                <Link
                  color='inherit'
                  component={RouterLink}
                  to={`/coin-league/profile/${address}`}>
                  <IntlMessages id='app.coinLeagues.profile' />
                </Link>
                <Typography>
                  {profileGame.data?.username
                    ? profileGame.data?.username
                    : isAddress(address)
                    ? reduceAddress(address)
                    : ''}
                </Typography>
              </Breadcrumbs>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems='center'>
                <Grid item>
                  <IconButton onClick={handleGoClick} size='small'>
                    <ArrowBackIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <Typography variant='h5'>
                    {championsBalance.isLoading ? (
                      <Skeleton />
                    ) : (
                      <>
                        <IntlMessages id='app.coinLeague.myChampions' /> (
                        {championsBalance.data})
                      </>
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Grid container spacing={4}>
                <Grid item>
                  <TextField
                    placeholder={messages['app.coinLeague.search'] as string}
                    variant='outlined'
                    type='search'
                    value={search}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
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
                      {myChampions.data?.length === 0 ? (
                        <Paper>
                          <Box py={4}>
                            <Grid container direction='column' spacing={4}>
                              <Grid item>
                                <Box
                                  display='flex'
                                  justifyContent='center'
                                  alignContent='center'
                                  alignItems='center'>
                                  <NFTEmptyStateImage />
                                </Box>
                              </Grid>
                              <Grid item>
                                <Typography align='center' variant='h5'>
                                  <IntlMessages id='nfts.wallet.noItemsFound' />
                                </Typography>
                                <Typography
                                  align='center'
                                  variant='body1'
                                  color='textSecondary'>
                                  <IntlMessages id='app.coinLeague.youDontHaveAnyChampionsYou' />
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Button
                                  href='/coin-league/champions/event'
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  variant='outlined'
                                  color='primary'>
                                  <IntlMessages id='app.coinLeauge.mintChampion' />
                                </Button>
                              </Grid>
                            </Grid>
                          </Box>
                        </Paper>
                      ) : (
                        <Grid container spacing={4}>
                          {myChampions.data
                            ?.filter((ch) => {
                              if (lazyName !== '') {
                                return (
                                  ch.name.search(lazyName.toLowerCase()) > -1
                                );
                              }

                              return true;
                            })
                            .map((champion, index: number) => (
                              <Grid item xs={12} sm={3} key={index}>
                                <ChampionCard champion={champion} />
                              </Grid>
                            ))}
                        </Grid>
                      )}
                    </>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default ProfileCollection;
