import React from 'react';
import {usePlayersGamesGraph} from 'modules/SquidLeague/hooks/usePlayersGameGraph';
import {Paper, Typography} from '@material-ui/core';

interface Props {
  id: string;
}

export const PlayersCard = (props: Props) => {
  const {id} = props;
  const query = usePlayersGamesGraph(id);

  return (
    <>
      {query.data?.data.players?.map((p) => (
        <Paper>
          <Typography variant='subtitle1' color='textPrimary'>
            {p.player.id}
          </Typography>
        </Paper>
      ))}{' '}
    </>
  );
};
