import React from 'react';
import {Paper, Box, Avatar, Grid, IconButton} from '@material-ui/core';
import {Fonts} from '../../../../shared/constants/AppEnums';
import {
  PeopleAltRounded,
  Twitter,
  Facebook,
  Telegram,
  HomeRounded,
  GitHub,
} from '@material-ui/icons';
import {CoinDetailCoinGecko} from 'types/coingecko';

interface ProfileCardProps {
  data: CoinDetailCoinGecko | undefined;
}

const ProfileCard: React.FC<ProfileCardProps> = ({data}) => {
  return (
    <Paper>
      <Box display='flex' flexDirection='row' justifyContent='center'>
        <Box mr={3} clone>
          <Avatar
            style={{color: 'white', width: 50, height: 50, marginTop: 18}}>
            {data?.image.large ? (
              <img src={data.image.large} alt='' />
            ) : (
              <PeopleAltRounded />
            )}
          </Avatar>
        </Box>
      </Box>
      <Box style={{marginTop: 10}} display='flex'>
        <Grid item xs={12} sm={12} md={12}>
          <Box>
            <Box
              display='flex'
              flexDirection='row'
              justifyContent='center'
              component='h3'
              textAlign='center'
              style={{padding: 5}}
              fontWeight={Fonts.BOLD}
              fontSize={15}>
              {data?.name}{' '}
              <span
                style={{
                  color: 'lightgrey',
                  fontWeight: 'lighter',
                  marginLeft: 5,
                }}>
                {' '}
                {data?.symbol}
              </span>
            </Box>
            <Box
              px={5}
              pt={2}
              style={{
                wordBreak: 'break-all',
                height: '100%',
              }}
              fontWeight={Fonts.LIGHT}
              fontSize={14}>
              {data?.description?.en ? data?.description?.en.slice(0, 300) : ''}
              ...
            </Box>
          </Box>
        </Grid>
      </Box>
      <Grid item xs={12} sm={12} md={12}>
        <Box
          px={10}
          py={3}
          display='flex'
          flexDirection='row'
          justifyContent='space-between'>
          {data?.links?.twitter_screen_name ? (
            <IconButton
              style={{padding: 3}}
              color='primary'
              onClick={() => {
                window.open(
                  `https://twitter.com/${data.links.twitter_screen_name}`,
                  '_blank',
                );
              }}>
              <Twitter />
            </IconButton>
          ) : (
            ''
          )}

          {data?.links?.facebook_username ? (
            <IconButton
              style={{padding: 3}}
              color='primary'
              onClick={() => {
                window.open(
                  `https://www.facebook.com/${data.links.facebook_username}`,
                  '_blank',
                );
              }}>
              <Facebook />
            </IconButton>
          ) : (
            ''
          )}

          {data?.links?.telegram_channel_identifier ? (
            <IconButton
              style={{padding: 3}}
              color='primary'
              onClick={() => {
                window.open(
                  `https://t.me/${data.links.telegram_channel_identifier}`,
                  '_blank',
                );
              }}>
              <Telegram />
            </IconButton>
          ) : (
            ''
          )}

          {data?.links?.repos_url?.github
            ? data.links.repos_url.github
                .filter((e) => e !== '' && e !== undefined)
                .map((e) => {
                  return (
                    <IconButton
                      style={{padding: 3}}
                      color='primary'
                      onClick={() => {
                        window.open(`${e}`, '_blank');
                      }}>
                      <GitHub />
                    </IconButton>
                  );
                })
            : ''}

          {data?.links?.homepage
            ? data.links.homepage
                .filter((e) => e !== '' && e !== undefined)
                .map((e) => {
                  return (
                    <IconButton
                      style={{padding: 3}}
                      color='primary'
                      onClick={() => {
                        window.open(`${e}`, '_blank');
                      }}>
                      <HomeRounded />
                    </IconButton>
                  );
                })
            : ''}
        </Box>
      </Grid>
    </Paper>
  );
};

export default ProfileCard;
