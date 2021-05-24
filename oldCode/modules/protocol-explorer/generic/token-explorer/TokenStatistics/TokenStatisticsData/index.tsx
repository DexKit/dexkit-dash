import React from 'react';
import {Avatar, Box, Card, Grid, makeStyles} from '@material-ui/core';
import {grey, indigo} from '@material-ui/core/colors/index';
import {TokenStatistic} from 'types/app';
import {useIntl} from 'react-intl';
import {Fonts} from 'shared/constants/AppEnums';
import Revenue from 'assets/images/metricsIcons/revenue.png';
import {CremaTheme} from 'types/AppContextPropsType';

interface Props {
  data: TokenStatistic | undefined;
}

const TokenStatisticsData: React.FC<Props> = ({data}) => {
  const useStyles = makeStyles((theme: CremaTheme) => ({
    avatar: {
      width: 50,
      height: 50,
      padding: '10px',
      borderRadius: '4px',
      backgroundColor: theme.palette.primary.main,
    },
  }));

  const classes = useStyles();

  const {messages} = useIntl();

  return (
    <>
      {data ? (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card>
              <Box
                padding={3}
                display='flex'
                alignItems='center'
                borderRadius={5}
                boxShadow={1}>
                <Avatar
                  className={classes.avatar}
                  src={Revenue}
                  alt='icon'
                  variant='square'
                />
                <Box position='relative' ml={2}>
                  <Box
                    mb={1}
                    component='p'
                    fontWeight={Fonts.BOLD}
                    fontSize={{xs: 12, sm: 12, xl: 13}}>
                    {messages['app.transferCount']}
                  </Box>
                  <Box
                    component='h4'
                    display='inline-block'
                    style={{padding: 0}}
                    fontWeight={Fonts.BOLD}
                    fontSize={{xs: 16, sm: 16, xl: 18}}>
                    {data.transferCount}
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <Box
                padding={3}
                display='flex'
                alignItems='center'
                borderRadius={5}
                boxShadow={1}>
                <Avatar
                  className={classes.avatar}
                  src={Revenue}
                  alt='icon'
                  variant='square'
                />
                <Box position='relative' ml={2}>
                  <Box
                    mb={1}
                    component='p'
                    fontWeight={Fonts.BOLD}
                    fontSize={{xs: 12, sm: 12, xl: 13}}>
                    {messages['app.uniqSenders']}
                  </Box>
                  <Box
                    component='h4'
                    display='inline-block'
                    style={{padding: 0}}
                    fontWeight={Fonts.BOLD}
                    fontSize={{xs: 16, sm: 16, xl: 18}}>
                    {data.uniqSenders}
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <Box
                padding={3}
                display='flex'
                alignItems='center'
                borderRadius={5}
                boxShadow={1}>
                <Avatar
                  className={classes.avatar}
                  src={Revenue}
                  alt='icon'
                  variant='square'
                />
                <Box position='relative' ml={2}>
                  <Box
                    mb={1}
                    component='p'
                    fontWeight={Fonts.BOLD}
                    fontSize={{xs: 12, sm: 12, xl: 13}}>
                    {messages['app.uniqReceivers']}
                  </Box>
                  <Box
                    component='h4'
                    display='inline-block'
                    style={{padding: 0}}
                    fontWeight={Fonts.BOLD}
                    fontSize={{xs: 16, sm: 16, xl: 18}}>
                    {data.uniqReceiver}
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <Box
                padding={3}
                display='flex'
                alignItems='center'
                borderRadius={5}
                boxShadow={1}>
                <Avatar
                  className={classes.avatar}
                  src={Revenue}
                  alt='icon'
                  variant='square'
                />
                <Box position='relative' ml={2}>
                  <Box
                    mb={1}
                    component='p'
                    fontWeight={Fonts.BOLD}
                    fontSize={{xs: 12, sm: 12, xl: 13}}>
                    {messages['app.totalAmount']}
                  </Box>
                  <Box
                    component='h4'
                    display='inline-block'
                    style={{padding: 0}}
                    fontWeight={Fonts.BOLD}
                    fontSize={{xs: 16, sm: 16, xl: 18}}>
                    {data.totalAmount}
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Card>
          <Box
            py={{xs: 5, sm: 5, xl: 5}}
            px={{xs: 6, sm: 6, xl: 6}}
            component='h3'
            fontFamily={Fonts.LIGHT}
            fontSize={{xs: 20, sm: 22, xl: 24}}>
            Loading...
          </Box>
        </Card>
      )}
    </>
  );
};

export default TokenStatisticsData;
