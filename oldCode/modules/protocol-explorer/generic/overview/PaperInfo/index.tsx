import React from 'react';
import GridContainer from '../../../../../@crema/core/GridContainer';
import {Paper, Box, Button, Avatar, Grid, IconButton} from '@material-ui/core';
import {Fonts} from '../../../../../shared/constants/AppEnums';
import {PeopleAltRounded, Twitter, Facebook, LinkedIn, Telegram} from '@material-ui/icons';



export default function SimplePaper() {
    
  return (
      <Paper elevation={3}>
      <Box display='flex' flexDirection='row' justifyContent='space-between'>
            <Box
              component='h3'
              style={{padding: 10, marginTop: 5}}
              fontWeight={Fonts.BOLD}
              fontSize={20}>
              Features Sponsors
            </Box>
            <Box display='flex'  >
                <Box mr={3} clone>
                    <Button style={{textTransform: 'none'}} color='secondary'>
                        View All
                    </Button>
                </Box> 
            </Box>
        </Box>

        <Box style={{marginTop: 10}} display='flex' flexDirection='row' justifyContent='space-between'>
        <GridContainer >
            <Grid item xs={12} sm={12} md={10}>
            <Box>
                <Box
                component='h3'
                style={{marginLeft: 10}}
                fontWeight={Fonts.BOLD}
                fontSize={15}>
                ChainLink <span style={{color:'lightgrey', fontWeight: 'lighter'}}>(LINK)</span> 
                </Box>
                <Box
                component='p'
                style={{marginLeft: 10, wordBreak: 'break-all'}}
                fontWeight={Fonts.LIGHT}
                fontSize={14}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam fadsfadsf adsf asdf afasdfasd fasdfasdfadsf
                </Box>
            </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={2}>
            <Box display='flex'  >
                <Box mr={3} clone>
                    <Avatar style={{color: '#3F51B5',
                        backgroundColor: 'red',
                        width: 50,
                        height: 50,
                        marginTop: 18}}>
                        <PeopleAltRounded  />
                    </Avatar>
                </Box> 
            </Box>
            </Grid>
            </GridContainer>
        </Box>
        <Grid item xs={12} sm={12} md={10}>
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
      </Box>
        </Grid>
        <Box display='flex' style={{marginTop: 10}} flexDirection='row' justifyContent='space-between'>
        <GridContainer >
            <Grid item xs={12} sm={12} md={10}>
            <Box>
                <Box
                component='h3'
                style={{marginLeft: 10}}
                fontWeight={Fonts.BOLD}
                fontSize={15}>
                ChainLink <span style={{color:'lightgrey', fontWeight: 'lighter'}}>(LINK)</span>
                </Box>
                <Box
                component='p'
                style={{marginLeft: 10, wordBreak: 'break-all'}}
                fontWeight={Fonts.LIGHT}
                fontSize={14}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
                </Box>
            </Box>
            </Grid>
            
            <Grid item xs={12} sm={12} md={2}>
            <Box display='flex'  >
                <Box mr={3} clone>
                    <Avatar style={{color: '#3F51B5',
                        backgroundColor: 'red',
                        width: 50,
                        height: 50,
                        marginTop: 18}}>
                        <PeopleAltRounded  />
                    </Avatar>
                </Box> 
            </Box>
            </Grid>
            </GridContainer>
        </Box>
        <Grid item xs={12} sm={12} md={10}>
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
      </Box> 
        </Grid>
        <Box style={{marginTop: 10}} display='flex' flexDirection='row' justifyContent='space-between'>
        <GridContainer >
            <Grid item xs={12} sm={12} md={10}>
            <Box>
                <Box
                component='h3'
                style={{marginLeft: 10}}
                fontWeight={Fonts.BOLD}
                fontSize={15}>
                ChainLink <span style={{color:'lightgrey', fontWeight: 'lighter'}}>(LINK)</span>
                </Box>
                <Box
                component='p'
                style={{marginLeft: 10, wordBreak: 'break-all'}}
                fontWeight={Fonts.LIGHT}
                fontSize={14}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
                </Box>
            </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={2}>
            <Box display='flex'  >
                <Box mr={3} clone>
                    <Avatar style={{color: '#3F51B5',
                        backgroundColor: 'red',
                        width: 50,
                        height: 50,
                        marginTop: 18}}>
                        <PeopleAltRounded  />
                    </Avatar>
                </Box> 
            </Box>
            </Grid>
            </GridContainer>
        </Box> 
        <Grid item xs={12} sm={12} md={10}>
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
      </Box>
        </Grid>
      </Paper>
  );
}