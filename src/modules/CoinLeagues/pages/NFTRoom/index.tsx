import React, {useCallback} from 'react';


import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import Box from '@material-ui/core/Box';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory} from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';


const NFTRoom = () => {
  const history = useHistory();

  const handleBack = useCallback((ev: any) => {
    history.goBack();
  }, [history]);

  return (
    <Grid container spacing={2} alignItems={'center'}>
      <Grid item xs={12}>
        <Box display={'flex'} alignItems={'center'}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant='h6' style={{margin: 5}}>
            NFT Room
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box display={'flex'} alignItems={'center'} p={4}>
          <img src={'/images/coinleagues/NFT_games_room.png'} style={{width:'100%'}} loading={'lazy'} alt={"Waiting room"} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default NFTRoom;
