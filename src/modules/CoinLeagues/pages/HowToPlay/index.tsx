import React, {useCallback} from 'react';
import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {useHistory} from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import {ReactComponent as MetamaskIcon} from 'assets/images/coinleagues/metamask.svg';
import IntlMessages from '../../../../@crema/utility/IntlMessages';

const HowToPlay = () => {
  const history = useHistory();

  const handleBack = useCallback(
    (ev: any) => {
      history.goBack();
    },
    [history],
  );

  const addMetamaskPolygon = useCallback(() => {
    if (window && window.ethereum) {
      const params = [
        {
          chainId: '0x89',
          chainName: 'Matic Mainnet',
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18,
          },
          rpcUrls: ['https://polygon-rpc.com/'],
          blockExplorerUrls: ['https://polygonscan.com/'],
        },
      ];
      window.ethereum.request({method: 'wallet_addEthereumChain', params});
    }
  }, []);

  return (
    <Grid container spacing={4} alignItems={'center'}>
      <Grid item xs={12}>
        <Box display={'flex'} alignItems={'center'}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant='h6' style={{margin: 5}}>
            <IntlMessages id='app.coinLeagues.howToPlay' />
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h4' component={'h1'}>
          1. <IntlMessages id='app.coinLeagues.setupPolygonWallet' />
        </Typography>
        <Box display={'flex'} alignItems={'center'} p={2}>
          <Typography variant='body1' component={'p'}>
            <IntlMessages id='app.coinLeagues.theFirstThingYouNeedToSetup' />
          </Typography>
        </Box>
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          p={2}>
          <Button
            variant='contained'
            color='primary'
            size='large'
            onClick={addMetamaskPolygon}
            startIcon={<MetamaskIcon />}>
            <IntlMessages id='app.coinLeagues.addPolygonNetwork' />
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h4' component={'h1'}>
          2. <IntlMessages id='app.coinLeagues.playingTheGame' />
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          p={2}>
          <img
            src={'/images/coinleagues/howtoplay/howtoplay-step6.png'}
            loading={'lazy'}
            alt={'Step 2'}
            style={{width: '20%'}}
          />
        </Box>
      </Grid>

      <Box display={'flex'} alignItems={'center'} p={2}>
        <Typography variant='body1' component={'p'}>
          <IntlMessages id='app.coinLeagues.useButtonsToAddMatic' />
        </Typography>
      </Box>

      <Box display={'flex'} alignItems={'center'} p={2}>
        <Typography variant='body1' component={'p'}>
          <IntlMessages id='app.coinLeagues.clickTheCoinLeagueSection' />
        </Typography>
      </Box>

      <Grid item xs={12}>
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          p={2}>
          <img
            src={'/images/coinleagues/howtoplay/howtoplay-step2.png'}
            loading={'lazy'}
            alt={'Step 3'}
            style={{width: '600px'}}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box display={'flex'} alignItems={'center'} p={2}>
          <Typography variant='body1' component={'p'}>
            <IntlMessages id='app.coinLeagues.youWillSeeTheGamesInProgress' />
          </Typography>
        </Box>

        <Box display={'flex'} alignItems={'center'} p={2}>
          <Typography variant='body1' component={'p'}>
            <IntlMessages id='app.coinLeagues.belowThatYouWillSeeGames' />
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          p={2}>
          <img
            src={'/images/coinleagues/howtoplay/howtoplay-step3.png'}
            loading={'lazy'}
            alt={'Step 4'}
            style={{width: '600px'}}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box display={'flex'} alignItems={'center'} p={2}>
          <Typography variant='body1' component={'p'}>
            <IntlMessages id='app.coinLeagues.inTheFirstDropdown' />
          </Typography>
        </Box>
        <Box display={'flex'} alignItems={'center'} p={2}>
          <Typography variant='body1' component={'p'}>
            <IntlMessages id='app.coinLeagues.inTheSecondDropdown' />
          </Typography>
        </Box>
        <Box display={'flex'} alignItems={'center'} p={2}>
          <Typography variant='body1' component={'p'}>
            <IntlMessages id='app.coinLeagues.theGameWillNotStart' />
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          p={2}>
          <img
            src={'/images/coinleagues/howtoplay/howtoplay-step5.png'}
            loading={'lazy'}
            alt={'Step 5'}
            style={{width: '600px'}}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box display={'flex'} alignItems={'center'} p={2}>
          <Typography variant='body1' component={'p'}>
            <IntlMessages id='app.coinLeagues.onceTheGameHasStarted' />
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default HowToPlay;
