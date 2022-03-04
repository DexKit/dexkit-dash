import React, {useState, useCallback} from 'react';
import {useIntl} from 'react-intl';
import {Box, Typography, Grid, Chip, Badge} from '@material-ui/core';

import ErrorView from 'modules/Common/ErrorView';
import GamesTable from './GamesTable';
import LoadingTable from 'modules/Common/LoadingTable';
import {useMyGames} from 'modules/CoinLeagues/hooks/useMyGames';

import {
  CoinLeagueGameStatus,
  FilterPlayerGame,
} from 'modules/CoinLeagues/constants/enums';
import {useGamesFilters} from 'modules/CoinLeagues/hooks/useGamesFilter';
import SquaredIconButton from 'shared/components/SquaredIconButton';

import {ReactComponent as FilterSearchIcon} from 'assets/images/icons/filter-search.svg';
import {useToggler} from 'hooks/useToggler';
import GameFilterDrawer from '../GameFilterDrawer';
import {useMobile} from 'hooks/useMobile';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import IntlMessages from '@crema/utility/IntlMessages';

interface Props {
  isNFT?: boolean;
  address?: string;
}

const MyGamesTable: React.FC<Props> = ({address, isNFT = false}) => {
  const defaultAccount = useDefaultAccount();

  const account = address ? address : defaultAccount;

  const [status, setStatus] = useState<CoinLeagueGameStatus>(
    CoinLeagueGameStatus.All,
  );

  const filtersState = useGamesFilters();
  const {messages} = useIntl();
  const {
    query,
    currentPage,
    rowsPerPage,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  } = useMyGames(
    {
      accounts: account ? [account] : undefined,
      filters: filtersState,
      status,
      player: account,
    },
    isNFT,
  );

  const handleClickAll = useCallback(() => {
    setStatus(CoinLeagueGameStatus.All);
  }, []);

  const handleClickWaiting = useCallback(() => {
    setStatus(CoinLeagueGameStatus.Waiting);
  }, []);

  const handleClickEnded = useCallback(() => {
    setStatus(CoinLeagueGameStatus.Ended);
  }, []);

  const handleClickAborted = useCallback(() => {
    setStatus(CoinLeagueGameStatus.Aborted);
  }, []);

  const handleClickStarted = useCallback(() => {
    setStatus(CoinLeagueGameStatus.Started);
  }, []);

  const filterToggler = useToggler();

  const handleToggleFilters = useCallback(() => {
    filterToggler.set(true);
  }, [filterToggler]);

  const isMobile = useMobile();

  return (
    <>
      <GameFilterDrawer
        show={filterToggler.show}
        onClose={filterToggler.toggle}
        filtersState={filtersState}
        disablePlayerFilter
      />
      <Box>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Grid
              container
              alignItems='center'
              alignContent='center'
              justifyContent='space-between'
              spacing={4}>
              <Grid item>
                <Typography variant='h5'>
                  <IntlMessages id='app.coinLeague.gameHistory' />
                </Typography>
              </Grid>
              {isMobile ? (
                <Grid item>
                  <SquaredIconButton size='small' onClick={handleToggleFilters}>
                    <Badge
                      color='primary'
                      variant='dot'
                      invisible={!filtersState.isModified()}>
                      <FilterSearchIcon style={{color: '#fff'}} />
                    </Badge>
                  </SquaredIconButton>
                </Grid>
              ) : null}
              <Grid item xs={isMobile ? 12 : undefined}>
                <Grid container justifyContent='center' spacing={2}>
                  <Grid item>
                    <Chip
                      clickable
                      size='small'
                      label={FilterPlayerGame.ALL}
                      color={status === 'All' ? 'primary' : 'default'}
                      onClick={handleClickAll}
                    />
                  </Grid>
                  <Grid item>
                    <Chip
                      clickable
                      size='small'
                      label={messages['app.coinLeague.waiting']}
                      color={
                        status === CoinLeagueGameStatus.Waiting
                          ? 'primary'
                          : 'default'
                      }
                      onClick={handleClickWaiting}
                    />
                  </Grid>
                  <Grid item>
                    <Chip
                      size='small'
                      clickable
                      label={messages['app.coinLeague.started'] as string}
                      color={
                        status === CoinLeagueGameStatus.Started
                          ? 'primary'
                          : 'default'
                      }
                      onClick={handleClickStarted}
                    />
                  </Grid>
                  <Grid item>
                    <Chip
                      clickable
                      size='small'
                      label={messages['app.coinLeague.ended'] as string}
                      color={
                        status === CoinLeagueGameStatus.Ended
                          ? 'primary'
                          : 'default'
                      }
                      onClick={handleClickEnded}
                    />
                  </Grid>
                  <Grid item>
                    <Chip
                      clickable
                      size='small'
                      label={messages['app.coinLeague.aborted'] as string}
                      color={
                        status === CoinLeagueGameStatus.Aborted
                          ? 'primary'
                          : 'default'
                      }
                      onClick={handleClickAborted}
                    />
                  </Grid>
                </Grid>
              </Grid>
              {!isMobile ? (
                <Grid item>
                  <SquaredIconButton onClick={handleToggleFilters}>
                    <Badge
                      color='primary'
                      variant='dot'
                      invisible={!filtersState.isModified()}>
                      <FilterSearchIcon style={{color: '#fff'}} />
                    </Badge>
                  </SquaredIconButton>
                </Grid>
              ) : null}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {query.loading ? (
              <LoadingTable columns={8} rows={10} />
            ) : query.error ? (
              <ErrorView message={query.error.message} />
            ) : (
              <GamesTable
                data={query.data?.games}
                isNFT={isNFT}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={rowsPerPageOptions}
                onChangePage={(newPage) => onChangePage(newPage)}
                onChangeRowsPerPage={(perPage) => onChangeRowsPerPage(perPage)}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default MyGamesTable;
