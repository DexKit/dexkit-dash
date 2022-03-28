import IntlMessages from '@crema/utility/IntlMessages';
import {Chip, Grid} from '@material-ui/core';
import React, {useState} from 'react';
import {useIntl} from 'react-intl';
import MainLayout from 'shared/components/layouts/main';
import PageHeader from 'shared/components/v2/partials/PageHeader';
import NFTLeagueGamesTable from '../components/NFTLeagueGamesTable';

import {GameStatus} from '../constants/enum';

export const NFTLeagueIndex = () => {
  const {messages} = useIntl();

  const [status, setStatus] = useState<GameStatus | undefined>(
    GameStatus.Waiting,
  );

  return (
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
              <Grid container justifyContent='center'>
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
                          status === GameStatus.Waiting ? 'primary' : 'default'
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
                          status === GameStatus.Started ? 'primary' : 'default'
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
                          status === GameStatus.Aborted ? 'primary' : 'default'
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
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <NFTLeagueGamesTable filters={{status}} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default NFTLeagueIndex;
