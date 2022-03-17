import React from 'react';
import {GameProfile} from 'modules/CoinLeagues/utils/types';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {truncateAddress} from 'utils/text';
import {Avatar, Link} from '@material-ui/core';

import {Link as RouterLink} from 'react-router-dom';
import {COINLEAGUE_PROFILE_ROUTE} from 'shared/constants/routes';
import {getPublicIPFSPath, isIPFS} from 'utils/ipfs';
import {useLabelAccounts} from 'hooks/useLabelAccounts';
import {GET_BITBOY_NAME} from 'modules/CoinLeagues/utils/game';

const useStyles = makeStyles((theme) => ({
  profileImageContainer: {
    borderRadius: '50%',
    backgroundColor: '#fff',
    height: theme.spacing(9),
    width: theme.spacing(9),
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    display: 'flex',
  },
  image: {
    height: theme.spacing(6),
    width: theme.spacing(6),
  },
}));

interface Props {
  address: string;
  profile?: GameProfile;
}

const UserProfileItem: React.FC<Props> = ({address, profile}) => {
  const classes = useStyles();

  if (profile) {
    return (
      <Grid alignItems='center' alignContent='center' container spacing={4}>
        <Grid item>
          <Box className={classes.profileImageContainer} marginLeft={2}>
            <Avatar
              src={
                isIPFS(profile.profileImage)
                  ? getPublicIPFSPath(profile.profileImage)
                  : ''
              }
              alt={profile.username}
            />
          </Box>
        </Grid>
        <Grid item>
          <Link
            color='inherit'
            component={RouterLink}
            to={`${COINLEAGUE_PROFILE_ROUTE}/${address}`}>
            <Typography color='inherit'>{profile.username}</Typography>
          </Link>
        </Grid>
      </Grid>
    );
  } else {
    let label: string | undefined;
    const bitboyMember = GET_BITBOY_NAME(address);

    if (bitboyMember) {
      label = bitboyMember.label;
    }

    return (
      <Link
        color='inherit'
        component={RouterLink}
        to={`${COINLEAGUE_PROFILE_ROUTE}/${address}`}>
        <Typography color='inherit'>
          {label !== undefined ? label : truncateAddress(address)}
        </Typography>
      </Link>
    );
  }
};

export default React.memo(UserProfileItem);
