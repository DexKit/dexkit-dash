import React, {useCallback, useMemo, useState} from 'react';
import {Breadcrumbs, Button, Grid, Link, Typography} from '@material-ui/core';
import {useWeb3} from 'hooks/useWeb3';
import {useCoinsLeagueFactory} from 'modules/CoinsLeague/hooks/useCoinsLeagueFactory';

import {ChainId} from 'types/blockchain';
import Chip from '@material-ui/core/Chip';
import CreateGameModal from 'modules/CoinsLeague/components/CreateGameModal';
import CardGame from 'modules/CoinsLeague/components/CardGame';
import CardGameSkeleton from 'modules/CoinsLeague/components/CardGame/index.skeleton';
import {makeStyles} from '@material-ui/core/styles';

import FilterListIcon from '@material-ui/icons/FilterList';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {Empty} from 'shared/components/Empty';
import SmallCardGame from 'modules/CoinsLeague/components/SmallCardGame';
import SmallCardGameSkeleton from 'modules/CoinsLeague/components/SmallCardGame/index.skeleton';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import {COINSLEAGUE_ROUTE, HOME_ROUTE} from 'shared/constants/routes';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    padding: theme.spacing(2),
    backgroundColor: '#1F1D2B',
  },
  chip: {
    color: '#fff',
    background: '#1F1D2B',
    border: '2px solid #2e3243',
  },
}));

const GamesList = () => {
  const classes = useStyles();
  const history = useHistory();
  const {chainId} = useWeb3();
  const [open, setOpen] = useState(false);
  const {games, totalGames, gamesQuery, gamesAddressQuery} =
    useCoinsLeagueFactory();
  const isLoading = gamesQuery.isLoading || gamesAddressQuery.isLoading;
  const gamesInProgress = useMemo(() => {
    return games?.filter((g) => g.started && !g.finished);
  }, [games]);

  const gamesToJoin = useMemo(() => {
    return games?.filter((g) => !g.started);
  }, [games]);

  const onClickEnterGame = useCallback((address: string)=> {
    history.push(`${COINSLEAGUE_ROUTE}/enter/${address}`)
  },[])

  return chainId ? (
    chainId === ChainId.Mumbai ? (
      <Grid container spacing={4}>
        <Grid item xs={12} sm={12} xl={12}>
          <Grid container>
            <Breadcrumbs
              style={{color: '#fff', fontSize: '0.75rem'}}
              separator={<NavigateNextIcon fontSize='small' />}>
              <Link color='inherit' component={RouterLink} to={HOME_ROUTE}>
                Dashboard
              </Link>
              <Link
                color='inherit'
                component={RouterLink}
                to={COINSLEAGUE_ROUTE}>
                Games
              </Link>
            </Breadcrumbs>
          </Grid>
          <Grid container xs={12} xl={12} sm={12}>
            <Typography variant='h5' style={{margin: 5}}>
              Coins League
            </Typography>
          </Grid>
        </Grid>

        <CreateGameModal open={open} setOpen={setOpen} />

        <Grid item xs={6}>
          <Typography variant='h6' style={{margin: 5}}>
            Games in Progress: {gamesInProgress?.length || 0}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant='h6' style={{margin: 5}}>
            View More
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            {gamesInProgress?.map((g, id) => (
              <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={id}>
                <SmallCardGame {...g} key={id} />
              </Grid>
            ))}
            {isLoading &&
              [1, 2, 3].map((v, i) => (
                <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={i}>
                  <SmallCardGameSkeleton />
                </Grid>
              ))}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Button fullWidth variant={'contained'} onClick={() => setOpen(true)}>
            {'CREATE GAME'}
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item sm={3}>
              <Grid item xs={12} sm={12}>
                <Typography variant='h6'>
                  {gamesToJoin?.length || 0}Games
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography gutterBottom>
                  Recently added &nbsp;
                  <ExpandMoreIcon
                    fontSize='small'
                    style={{verticalAlign: 'top'}}
                  />
                </Typography>
              </Grid>
            </Grid>
            <Grid item sm={6} spacing={1} justifyContent='center'>
              <Grid container justifyContent='center' spacing={2}>
                <Grid item>
                  <Chip clickable className={classes.chip} label='All' />
                </Grid>
                <Grid item>
                  <Chip clickable className={classes.chip} label='Fast' />
                </Grid>
                <Grid item>
                  <Chip clickable className={classes.chip} label='Medium' />
                </Grid>
                <Grid item>
                  <Chip clickable className={classes.chip} label='24hrs' />
                </Grid>
              </Grid>
            </Grid>
            <Grid container sm={3} justifyContent='flex-end'>
              <Button variant='text'>
                <FilterListIcon style={{color: '#fff'}} />
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            {gamesToJoin?.map((g, id) => (
              <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={id}>
                <CardGame game={g} id={g.address} onClick={onClickEnterGame} />
              </Grid>
            ))}
            {isLoading &&
              [1, 2, 3].map((v, i) => (
                <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={i}>
                  <CardGameSkeleton />
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>
    ) : (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Empty
            title={'Wrong Network'}
            message={'Please connect your wallet to Mumbai Polygon Testnet'}
          />
        </Grid>
      </Grid>
    )
  ) : (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Empty title={'No Wallet'} message={'Please connect your wallet'} />
      </Grid>
    </Grid>
  );
};

export default GamesList;
