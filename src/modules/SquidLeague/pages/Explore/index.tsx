import IntlMessages from '@crema/utility/IntlMessages';
import {Chip, Grid} from '@material-ui/core';
import {CloseRounded} from '@material-ui/icons';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import React, {useState} from 'react';
import {useIntl} from 'react-intl';
import MainLayout from 'shared/components/layouts/main';
import PageHeader from 'shared/components/v2/partials/PageHeader';
import {SQUIDLEAGUE_ROUTE} from 'shared/constants/routes';
import GamesTable from 'modules/SquidLeague/components/GamesTable';

import {GameStatus} from '../../constants/enum';

export const ExploreGames = () => {
  const {formatMessage} = useIntl();

  const [status, setStatus] = useState<GameStatus | undefined>();

  const [showMyGames, setShowMyGames] = useState(false);

  const defaultAccount = useDefaultAccount();

  return (
    <MainLayout>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <PageHeader
            useBackUriFromRouter={true}
            title={formatMessage({
              id: 'nftLeague.games',
              defaultMessage: 'SquidLeague Game',
            })}
            breadcrumbs={[
              {caption: 'Wallet', uri: '/'},
              {caption: 'Squid League', uri: SQUIDLEAGUE_ROUTE},
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Grid container justifyContent='space-between'>
                <Grid item></Grid>
                <Grid item>
                  <Grid
                    container
                    spacing={2}
                    justifyContent='center'
                    alignItems='center'
                    alignContent='center'>
                    <Grid item>
                      <Chip
                        variant='outlined'
                        size='small'
                        color={status === undefined ? 'primary' : 'default'}
                        label={
                          <IntlMessages
                            id='squidLeague.all'
                            defaultMessage={'All'}
                          />
                        }
                        onClick={() => setStatus(undefined)}
                      />
                    </Grid>
                    <Grid item>
                      <Chip
                        variant='outlined'
                        size='small'
                        color={
                          status === GameStatus.Joining ? 'primary' : 'default'
                        }
                        label={
                          <IntlMessages
                            id='squidLeague.joining'
                            defaultMessage={'Joining'}
                          />
                        }
                        onClick={() => setStatus(GameStatus.Joining)}
                      />
                    </Grid>
                    <Grid item>
                      <Chip
                        variant='outlined'
                        size='small'
                        color={
                          status === GameStatus.Started ? 'primary' : 'default'
                        }
                        label={
                          <IntlMessages
                            id='squidLeague.started'
                            defaultMessage={'Started'}
                          />
                        }
                        onClick={() => setStatus(GameStatus.Started)}
                      />
                    </Grid>
                    <Grid item>
                      <Chip
                        variant='outlined'
                        size='small'
                        color={
                          status === GameStatus.Setup ? 'primary' : 'default'
                        }
                        onClick={() => setStatus(GameStatus.Setup)}
                        label={
                          <IntlMessages
                            id='squidLeague.setup'
                            defaultMessage={'Setup'}
                          />
                        }
                      />
                    </Grid>
                    <Grid item>
                      <Chip
                        variant='outlined'
                        size='small'
                        color={
                          status === GameStatus.Finished ? 'primary' : 'default'
                        }
                        onClick={() => setStatus(GameStatus.Finished)}
                        label={
                          <IntlMessages
                            id='squidLeague.finished'
                            defaultMessage={'Finished'}
                          />
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Chip
                    size='small'
                    icon={showMyGames ? <CloseRounded /> : undefined}
                    color={showMyGames ? 'primary' : 'default'}
                    clickable
                    onClick={() => setShowMyGames((value) => !value)}
                    label={
                      <IntlMessages
                        id='squidLeague.myGames'
                        defaultMessage='My Games'
                      />
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <GamesTable
                filters={{
                  status,
                  account: showMyGames ? defaultAccount : undefined,
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default ExploreGames;
