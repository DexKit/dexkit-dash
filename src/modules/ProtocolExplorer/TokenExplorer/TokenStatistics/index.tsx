import React from 'react';
import {useIntl} from 'react-intl';
import {useTokenStatistics} from 'hooks/protocolExplorer/useTokenStatistics';
import {Avatar, Box, Card, Grid} from '@material-ui/core';
import {Fonts} from 'shared/constants/AppEnums';
import LoadingView from 'modules/Common/LoadingView';
import ErrorView from 'modules/Common/ErrorView';
import Revenue from 'assets/images/metricsIcons/revenue.png';
import {useStyles} from './index.style';

interface Props {
  address: string;
}

const TokenStatistics: React.FC<Props> = (props) => {
  const {address} = props;
  const {messages} = useIntl();
  const {loading, error, data} = useTokenStatistics({address});
  const classes = useStyles();

  return (
    <Box py={{xs: 5, sm: 5, xl: 5}} px={{xs: 6, sm: 6, xl: 6}} height={1} clone>
      {loading ? (
        <LoadingView />
      ) : error ? (
        <ErrorView message={error.message} />
      ) : (
        <>
          {data?.ethereum?.transfers?.map((e) => (
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
                        {e.count}
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
                        {e.sender_count}
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
                        {e.receiver_count}
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
                        {e.amount}
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          ))}
        </>
      )}
    </Box>
  );
};

export default TokenStatistics;
