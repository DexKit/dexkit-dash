import React from 'react';
import {Button, Grid, Typography} from '@material-ui/core';
import {useWeb3} from 'hooks/useWeb3';
import {useCoinsLeagueFactory} from 'modules/CoinsLeague/hooks/useCoinsLeagueFactory';

import {ChainId} from 'types/blockchain';

import {GameView} from '../GamesView';

const GamesList = () => {
  const {chainId} = useWeb3();
  const {games, totalGames} = useCoinsLeagueFactory();

  return chainId ? (
    chainId === ChainId.Mumbai ? (
      <Grid container>
         <Grid item xs={6}>
            Games in Progress: games?.filter(g => g.started && !g.finished)

         </Grid>
         <Grid item xs={6}>
            View More
          </Grid>

          <Grid item xs={12}>
            View More
          </Grid>


          <Grid item xs={12}>
            {games?.filter(g => g.started && !g.finished).map((g)=> {
              return <>{g.address} </>

            })}
         </Grid>

         <Grid item xs={4}>
            {games?.filter(g=> !g.started).length || 0  } Games
          </Grid>

          <Grid item xs={12}>
            <Button  fullWidth variant={'contained'}>
             {'CREATE GAME'}
            </Button>
          </Grid>

         <Grid item xs={4}>
            View More
          </Grid>

          <Grid item xs={4}>
           Filter
          </Grid>

          <Grid item xs={12}>
            {games?.filter(g=> !g.started).map(g => <>g.address</>)  }
          </Grid>
      </Grid>
    ) : (
      <>
        <Typography>
          Please connect your wallet to Mumbai Polygon Testnet
        </Typography>
      </>
    )
  ) : (
    <>
      <Typography>Please connect your wallet</Typography>
    </>
  );
};

export default GamesList;
