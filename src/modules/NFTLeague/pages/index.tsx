import IntlMessages from '@crema/utility/IntlMessages';
import {
  Chip,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
} from '@material-ui/core';
import {CloseRounded} from '@material-ui/icons';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {useMobile} from 'hooks/useMobile';
import {useToggler} from 'hooks/useToggler';
import {useWeb3} from 'hooks/useWeb3';
import CreateGameButton from 'modules/CoinLeagues/components/v2/CreateGameButton';
import React, {useCallback, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {useHistory} from 'react-router';
import MainLayout from 'shared/components/layouts/main';
import {NetworkSupportCard} from 'shared/components/NetworkSupportCard';
import PageHeader from 'shared/components/v2/partials/PageHeader';
import {NFTLEAGUE_ROUTE} from 'shared/constants/routes';
import CardGame from '../components/CardGame';
import GameDescriptionPaper from '../components/GameDescriptionPaper';
import ShareGameDialog from '../components/ShareGameDialog';
import {NFT_LEAGUE_SUPPORTED_NETWORKS} from '../constants';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import {GameStatus} from '../constants/enum';
import {useGamesGraph} from '../hooks/useGamesGraph';
import {isSupportedBlockchain} from '../utils/blockchain';
import {Empty} from 'shared/components/Empty';

const PAGES = [4, 8, 16, 32, 64];

export const NFTLeagueIndex = () => {
  const {formatMessage} = useIntl();
  const {chainId} = useWeb3();

  const [rowsPerPage, setRowsPerPage] = useState(PAGES[0]);

  const [page, setPage] = useState(0);

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

  const isMobile = useMobile();

  const {data, isLoading} = useGamesGraph(
    status,
    showMyGames ? defaultAccount : undefined,
    rowsPerPage,
    page * rowsPerPage,
  );

  const shareDialogToggler = useToggler();

  const [shareSelectedId, setShareSelectedId] = useState<string>();

  const handleCloseShareDialog = useCallback(() => {
    setShareSelectedId(undefined);
    shareDialogToggler.set(false);
  }, [shareDialogToggler]);

  const handleShareGame = useCallback(
    (id) => {
      setShareSelectedId(id);
      shareDialogToggler.set(true);
    },
    [shareDialogToggler],
  );

  const handleViewGame = useCallback(
    (id: string) => {
      history.push(`/nft-league/${id}`);
    },
    [history],
  );

  const handleChangeRowsPerPage = useCallback(
    (e) => setRowsPerPage(e.target.value),
    [],
  );

  const handleBackButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setPage((value) => value - 1);
    },
    [],
  );

  const handleNextButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setPage((value) => value + 1);
    },
    [],
  );

  useEffect(() => {
    setPage(0);
  }, [status]);

  return (
    <>
      <ShareGameDialog
        dialogProps={{
          open: shareDialogToggler.show,
          onClose: handleCloseShareDialog,
          fullWidth: true,
          maxWidth: 'sm',
          fullScreen: isMobile,
        }}
        id={shareSelectedId}
      />
      <MainLayout>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <PageHeader
              useBackUriFromRouter={true}
              title={formatMessage({
                id: 'nftleague.page.title',
                defaultMessage: 'NFT League',
              })}
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
            <>
              <Grid item xs={12}>
                <GameDescriptionPaper />
              </Grid>
              <Grid item xs={12}>
                <CreateGameButton
                  onClick={handleGoCreate}
                  subtitle={
                    <IntlMessages
                      id='nftLeague.nftLeague'
                      defaultMessage='NFT League'
                    />
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Grid
                      container
                      justifyContent='space-between'
                      alignItems='center'
                      alignContent='center'
                      spacing={4}>
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
                              size='small'
                              variant='outlined'
                              color={
                                status === undefined ? 'primary' : 'default'
                              }
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
                  {data?.length === 0 ? (
                    <Grid item xs={12}>
                      <Empty
                        title={formatMessage({
                          id: 'nftLeague.noResults',
                          defaultMessage: 'No Results',
                        })}
                        message=''
                      />
                    </Grid>
                  ) : (
                    <Grid item xs={12}>
                      <Grid container spacing={4}>
                        {isLoading &&
                          new Array(8).fill(null).map((a, index) => (
                            <Grid key={index} item xs={12} sm={3}>
                              <CardGame loading />
                            </Grid>
                          ))}
                        {data?.map((game, index) => (
                          <Grid key={index} item xs={12} sm={3}>
                            <CardGame
                              onShare={handleShareGame}
                              game={game}
                              onClick={handleViewGame}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Grid
                      container
                      spacing={2}
                      justifyContent='flex-end'
                      alignItems='center'
                      alignContent='center'>
                      <Grid item>
                        <FormControl variant='outlined'>
                          <Select
                            variant='outlined'
                            onChange={handleChangeRowsPerPage}
                            value={rowsPerPage}>
                            {PAGES.map((p, index) => (
                              <MenuItem value={p} key={index}>
                                {p}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item>
                        <IconButton
                          onClick={handleBackButtonClick}
                          disabled={page === 0}>
                          <NavigateBeforeIcon />
                        </IconButton>
                      </Grid>
                      <Grid>
                        <IconButton
                          onClick={handleNextButtonClick}
                          disabled={(data?.length || 0) < rowsPerPage}>
                          <NavigateNextIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </MainLayout>
    </>
  );
};

export default NFTLeagueIndex;
