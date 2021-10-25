import React, {useState} from 'react';

import {useIntl} from 'react-intl';

import {Box, Chip, Grid, Typography} from '@material-ui/core';

import ErrorView from 'modules/Common/ErrorView';
import GamesTable from './GamesTable';
import LoadingTable from 'modules/Common/LoadingTable';
import {useMyGames} from 'modules/CoinLeagues/hooks/useMyGames';
import {useWeb3} from 'hooks/useWeb3';
import {FilterPlayerGame} from 'modules/CoinLeagues/constants/enums';

const MyGamesTable: React.FC = () => {
  const {account} = useWeb3();
  const {messages} = useIntl();
  const [filterGame, setFilterGame] = useState(FilterPlayerGame.ALL);

  const {
    query,
    currentPage,
    rowsPerPage,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  } = useMyGames(filterGame, account ? [account] : undefined);

  return (
    <Box>
      <Box
        py={4}
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        alignContent='center'>
        <Typography variant='h5' display={'block'} align={'center'}>
          {messages['app.viewGames']}
        </Typography>
        <Box display='flex' justifyContent='flex-end' alignItems='center'>
          <Box display='flex' alignItems='center' alignContent='center' mr={2}>
            <Grid container justifyContent='center' spacing={2}>
              <Grid item>
                <Chip
                  clickable
                  label={FilterPlayerGame.ALL}
                  color={
                    filterGame === FilterPlayerGame.ALL ? 'primary' : 'default'
                  }
                  onClick={() => setFilterGame(FilterPlayerGame.ALL)}
                />
              </Grid>
              <Grid item>
                <Chip
                  clickable
                  label={FilterPlayerGame.Waiting}
                  color={
                    filterGame === FilterPlayerGame.Waiting
                      ? 'primary'
                      : 'default'
                  }
                  onClick={() => setFilterGame(FilterPlayerGame.Waiting)}
                />
              </Grid>
              <Grid item>
                <Chip
                  clickable
                  label={FilterPlayerGame.Started}
                  color={
                    filterGame === FilterPlayerGame.Started
                      ? 'primary'
                      : 'default'
                  }
                  onClick={() => setFilterGame(FilterPlayerGame.Started)}
                />
              </Grid>
              <Grid item>
                <Chip
                  clickable
                  label={FilterPlayerGame.Ended}
                  color={
                    filterGame === FilterPlayerGame.Ended
                      ? 'primary'
                      : 'default'
                  }
                  onClick={() => setFilterGame(FilterPlayerGame.Ended)}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>

      {query.loading ? (
        <LoadingTable columns={8} rows={10} />
      ) : query.error ? (
        <ErrorView message={query.error.message} />
      ) : (
        <GamesTable
          data={query.data?.games}
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

export default MyGamesTable;
