import {Avatar, ButtonBase, makeStyles} from '@material-ui/core';
import {useProfileGame} from 'modules/CoinLeagues/hooks/useGameProfile';
import React, {memo} from 'react';
import {useHistory} from 'react-router';
import {COINLEAGUE_PROFILE_ROUTE} from 'shared/constants/routes';

const useStyles = makeStyles((theme) => ({
  avatarButton: {
    borderRadius: '50%',
  },
}));

function NFTLeagueAvatar(props: any) {
  const {player, id} = props;

  const classes = useStyles();

  const {data} = useProfileGame(id);

  const history = useHistory();

  return (
    <ButtonBase
      onClick={() => history.push(`${COINLEAGUE_PROFILE_ROUTE}/${id}`)}
      component={Avatar}
      className={classes.avatarButton}>
      <Avatar
        src={data?.profileImage}
        title={player.id}
        alt={data?.username || data?.address}
      />
    </ButtonBase>
  );
}

export default memo(NFTLeagueAvatar);
