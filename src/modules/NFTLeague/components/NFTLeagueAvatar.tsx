import {Avatar, AvatarProps, makeStyles} from '@material-ui/core';
import {useProfileGame} from 'modules/CoinLeagues/hooks/useGameProfile';
import React, {memo} from 'react';
import {useHistory} from 'react-router';
import {COINLEAGUE_PROFILE_ROUTE} from 'shared/constants/routes';
import {getNormalizedUrl} from 'utils/browser';

const useStyles = makeStyles((theme) => ({
  avatarButton: {
    borderRadius: '50%',
    width: theme.spacing(10),
    height: theme.spacing(10),
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(8),
      height: theme.spacing(8),
    },
  },
}));

interface Props extends AvatarProps {
  player: any;
}

function NFTLeagueAvatar(props: Props) {
  const {player} = props;

  const classes = useStyles();

  const {data} = useProfileGame(player.player.id);

  const history = useHistory();

  return (
    <Avatar
      {...(props as AvatarProps)}
      onClick={() =>
        history.push(`${COINLEAGUE_PROFILE_ROUTE}/${player.player.id}`)
      }
      src={getNormalizedUrl(data?.profileImage || '')}
      title={player.id}
      alt={data?.username || data?.address}
      className={classes.avatarButton}
    />
  );
}

export default memo(NFTLeagueAvatar);
