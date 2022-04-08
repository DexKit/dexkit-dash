import IntlMessages from '@crema/utility/IntlMessages';
import {Button, Chip, Grid} from '@material-ui/core';
import {CloseRounded} from '@material-ui/icons';
import Add from '@material-ui/icons/Add';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {useWeb3} from 'hooks/useWeb3';
import React, {useCallback, useState} from 'react';
import {useIntl} from 'react-intl';
import {useHistory} from 'react-router';
import MainLayout from 'shared/components/layouts/main';
import {NetworkSupportCard} from 'shared/components/NetworkSupportCard';
import PageHeader from 'shared/components/v2/partials/PageHeader';
import {NFTLEAGUE_ROUTE} from 'shared/constants/routes';
import NFTLeagueGamesTable from '../components/NFTLeagueGamesTable';
import {NFT_LEAGUE_SUPPORTED_NETWORKS} from '../constants';

import {GameStatus} from '../constants/enum';
import {isSupportedBlockchain} from '../utils/blockchain';

export const NFTLeagueIndex = () => {
  const {messages} = useIntl();
  const {chainId} = useWeb3();

  const defaultAccount = useDefaultAccount();

  const [showMyGames, setShowMyGames] = useState(false);

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
      <MainLayout>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <PageHeader
              useBackUriFromRouter={true}
              title={messages['nftLeague.games'] as string}
              breadcrumbs={[
                {caption: 'Wallet', uri: '/'},
                {caption: 'NFT League', uri: '/nft-league'},
              ]}
            />
          </Grid>
          <Grid item xs={12}>
            {!isSupportedBlockchain(chainId) && (
              <NetworkSupportCard
                supportedChains={NFT_LEAGUE_SUPPORTED_NETWORKS}
              />
            )}
          </Grid>

          {isSupportedBlockchain(chainId) && (
            <Grid item xs={12}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Grid
                    container
                    justifyContent='space-between'
                    alignItems='center'
                    alignContent='center'
                    spacing={4}>
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
                              status === GameStatus.Ended
                                ? 'primary'
                                : 'default'
                            }
                            onClick={() => setStatus(GameStatus.Ended)}
                            label={<IntlMessages id='nftLeague.ended' />}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Chip
                        size='small'
                        variant='outlined'
                        icon={showMyGames ? <CloseRounded /> : undefined}
                        color={showMyGames ? 'primary' : 'default'}
                        clickable
                        onClick={() => setShowMyGames((value) => !value)}
                        label={
                          <IntlMessages
                            id='nftLeague.myGames'
                            defaultMessage='My Games'
                          />
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <NFTLeagueGamesTable
                    filters={{
                      status,
                      account: showMyGames ? defaultAccount : undefined,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </MainLayout>
    </>
  );
};

export default NFTLeagueIndex;
