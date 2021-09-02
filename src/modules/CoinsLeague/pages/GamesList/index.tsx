import React, { useState } from 'react';
import {Button, Grid, Typography} from '@material-ui/core';
import {useWeb3} from 'hooks/useWeb3';
import {useCoinsLeagueFactory} from 'modules/CoinsLeague/hooks/useCoinsLeagueFactory';

import {ChainId} from 'types/blockchain';

import {GameView} from '../GamesView';
import CreateGameModal from 'modules/CoinsLeague/components/CreateGameModal';

const GamesList = () => {
  const {chainId} = useWeb3();
  const [open, setOpen] = useState(false);
  const {games, totalGames} = useCoinsLeagueFactory();

  return chainId ? (
    chainId === ChainId.Mumbai ? (
      <Grid container>
        <CreateGameModal open={open} setOpen={setOpen}/>
         <Grid item xs={6}>
            Games in Progress: {games?.filter(g => g.started && !g.finished).length}

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
            <Button  fullWidth variant={'contained'} onClick={()=> setOpen(true)}>
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
