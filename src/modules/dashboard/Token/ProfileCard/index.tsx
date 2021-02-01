import React from 'react';
import {Paper, Box, Avatar, Grid, IconButton} from '@material-ui/core';
import {Fonts} from '../../../../shared/constants/AppEnums';
import {PeopleAltRounded, Twitter, Facebook, LinkedIn, Telegram, HomeRounded} from '@material-ui/icons';



export default function SimplePaper() {
    
  return (
      <Paper elevation={3}>
            <Box display='flex' flexDirection='row' justifyContent='center'>
                <Box mr={3} clone>
                    <Avatar style={{
                        color: 'white',
                        width: 50,
                        height: 50,
                        marginTop: 18}}>
                        <PeopleAltRounded  />
                    </Avatar>
                </Box> 
            </Box>
        <Box style={{marginTop: 10}} display='flex'>
            <Grid item xs={12} sm={12} md={12}>
            <Box>
                <Box
                 display='flex' flexDirection='row' justifyContent='center'
                component='h3'
                textAlign="center"
                style={{padding: 5}}
                fontWeight={Fonts.BOLD}
                fontSize={15}>
                DexKit  <span style={{color:'lightgrey', fontWeight: 'lighter', marginLeft: 5}}> KIT</span> 
                </Box>
                <Box
                component='p'
                style={{marginLeft: 10, marginRight: 10, wordBreak: 'break-all', padding: 5}}
                fontWeight={Fonts.LIGHT}
                fontSize={14}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmo 
                Lorem ipsum dolor sit amet, 
                Lorem ipsum dolor sit amet
                </Box>
            </Box>
            </Grid>
        </Box>
        <Grid item xs={12} sm={12} md={12}>
        <Box display='flex' flexDirection='row' justifyContent='center'>
        <IconButton style={{padding: 3}} color='primary'>
            <Twitter />
        </IconButton>
        <IconButton style={{padding: 3}} color='primary'>
            <Facebook />
        </IconButton>
        <IconButton style={{padding: 3}} color='primary'>
            <LinkedIn />
        </IconButton>
        <IconButton style={{padding: 3}} color='primary'>
            <Telegram />
        </IconButton>
        <IconButton style={{padding: 3}} color='primary'>
            <HomeRounded />
        </IconButton>
      </Box>
        </Grid>
      </Paper>
  );
}