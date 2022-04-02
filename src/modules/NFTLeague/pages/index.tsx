import IntlMessages from '@crema/utility/IntlMessages';
import {Button, Chip, Grid} from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import React, {useCallback, useState} from 'react';
import {useIntl} from 'react-intl';
import {useHistory} from 'react-router';
import MainLayout from 'shared/components/layouts/main';
import {NetworkSupportBackdrop} from 'shared/components/NetworkSupportBackdrop';
import PageHeader from 'shared/components/v2/partials/PageHeader';
import {NFTLEAGUE_ROUTE} from 'shared/constants/routes';
import NFTLeagueGamesTable from '../components/NFTLeagueGamesTable';
import {NFT_LEAGUE_SUPPORTED_NETWORKS} from '../constants';

import {GameStatus} from '../constants/enum';

export const NFTLeagueIndex = () => {
  const {messages} = useIntl();

  const [status, setStatus] = useState<GameStatus | undefined>(
    GameStatus.Waiting,
  );

  const history = useHistory();

  const handleGoCreate = useCallback(
    () => history.push(`${NFTLEAGUE_ROUTE}/create`),
    [history],
  );

  return (
    <>
      <NetworkSupportBackdrop supportedChains={NFT_LEAGUE_SUPPORTED_NETWORKS} />
      <MainLayout>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <PageHeader
              backUri='/'
              title={messages['nftLeague.games'] as string}
              breadcrumbs={[
                {caption: 'Wallet', uri: '/'},
                {caption: 'NFT League', uri: '/nft-league'},
              ]}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Grid
                  container
                  justifyContent='space-between'
                  alignItems='center'
                  alignContent='center'>
                  <Grid item>
                    <Button
                      onClick={handleGoCreate}
                      color='primary'
                      startIcon={<Add />}>
                      <IntlMessages
                        id='nftLeague.createGame'
                        defaultMessage='Create Game'
                      />
                    </Button>
                  </Grid>
                  <Grid item>
                    <Grid
                      container
                      spacing={2}
                      justifyContent='center'
                      alignItems='center'
                      alignContent='center'>
                      <Grid item>
                        <Chip
                          size='small'
                          variant='outlined'
                          color={status === undefined ? 'primary' : 'default'}
                          label={<IntlMessages id='nftLeague.all' />}
                          onClick={() => setStatus(undefined)}
                        />
                      </Grid>
                      <Grid item>
                        <Chip
                          size='small'
                          variant='outlined'
                          color={
                            status === GameStatus.Waiting
                              ? 'primary'
                              : 'default'
                          }
                          label={<IntlMessages id='nftLeague.waiting' />}
                          onClick={() => setStatus(GameStatus.Waiting)}
                        />
                      </Grid>
                      <Grid item>
                        <Chip
                          size='small'
                          variant='outlined'
                          color={
                            status === GameStatus.Started
                              ? 'primary'
                              : 'default'
                          }
                          label={<IntlMessages id='nftLeague.inProgress' />}
                          onClick={() => setStatus(GameStatus.Started)}
                        />
                      </Grid>
                      <Grid item>
                        <Chip
                          size='small'
                          variant='outlined'
                          color={
                            status === GameStatus.Aborted
                              ? 'primary'
                              : 'default'
                          }
                          onClick={() => setStatus(GameStatus.Aborted)}
                          label={<IntlMessages id='nftLeague.aborted' />}
                        />
                      </Grid>
                      <Grid item>
                        <Chip
                          size='small'
                          variant='outlined'
                          color={
                            status === GameStatus.Ended ? 'primary' : 'default'
                          }
                          onClick={() => setStatus(GameStatus.Ended)}
                          label={<IntlMessages id='nftLeague.ended' />}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item></Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <NFTLeagueGamesTable filters={{status}} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </MainLayout>
    </>
  );
};

export default NFTLeagueIndex;
