import React, {useCallback} from 'react';
import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import {ReactComponent as MetamaskIcon} from 'assets/images/coinleagues/metamask.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    item: {
      marginBottom: '4px',
      marginLeft: '2px',
    },
  }),
);

const HowToPlay = () => {
  const classes = useStyles();
  const history = useHistory();

  const handleBack = useCallback((ev: any) => {
    history.goBack();
  }, [history]);

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
            How to Play
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h4' component={'h1'}>
          1. Setup Polygon Wallet
        </Typography>
        <Box display={'flex'} alignItems={'center'} p={2}>
          <Typography variant='body1' component={'p'}>
            The first thing you need to setup is the Polygon network in your
            Metamask wallet, if you haven’t setup a MetaMask wallet click the
            button to add Polygon to your Metamask wallet.
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
            Add Polygon Network
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h4' component={'h1'}>
          2. Playing The Game
        </Typography>
        
      </Grid>

      <Grid item xs={12}>
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} p={2}>
          <img
            src={'/images/coinleagues/howtoplay/howtoplay-step6.png'}
            loading={'lazy'}
            style={{width: '20%'}}
            alt={'Steps'}
          />
        </Box>
      </Grid>

      <Box display={'flex'} alignItems={'center'} p={2}>
          <Typography variant='body1' component={'p'}>
          Use the “Swap” “Buy Matic” or “Bridge” buttons to add Matic to your polygon wallet. Another easy way to send Matic to your Polygon wallet is to send Matic from an exchange that supports the polygon network.
           Withdraw Matic to your Polygon wallets address using the “POLYGON” network in the exchanges withdraw section. 
           Once you have everything set up and connected in your Metamask wallet and you have MATIC in your Polygon network, 
          </Typography>
        </Box>

        <Box display={'flex'} alignItems={'center'} p={2}>
          <Typography variant='body1' component={'p'}>
          Click the Coin Leagues section on the main menu to view the current games you can join.
          </Typography>
        </Box>

      <Grid item xs={12}>
        <Box display={'flex'} alignItems={'center'} p={2}>
          <img
            src={'/images/coinleagues/howtoplay/howtoplay-step2.png'}
            loading={'lazy'}
            style={{width: '100%'}}
            alt={'Steps'}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box display={'flex'} alignItems={'center'} p={2}>
          <Typography variant='body1' component={'p'}>
            You will see the games that are in progress. You can click and view
            any game happening.
          </Typography>
        </Box>

        <Box display={'flex'} alignItems={'center'} p={2}>
          <Typography variant='body1' component={'p'}>
            Below that you will see games that are available to play and that
            are waiting on players to start the game. When clicking on a game
            you will see the type of game it is either Bull or Bear. if it’s
            1hr, 5 mins, 4hrs or even 24 hours.
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box display={'flex'} alignItems={'center'} p={2}>
          <img
            src={'/images/coinleagues/howtoplay/howtoplay-step3.png'}
            loading={'lazy'}
            style={{width: '100%'}}
            alt={'Steps'}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box display={'flex'} alignItems={'center'} p={2}>
          <Typography variant='body1' component={'p'}>
          In the first dropdown select your Captain Coin (the coin you think is going to gain the most for BULL games or lose the most for BEAR games) this captain coin will receive a 1.2x Multiplier on its % gain for bull games or % lost for bear games.
          </Typography>
        </Box>
        <Box display={'flex'} alignItems={'center'} p={2}>
          <Typography variant='body1' component={'p'}>
          In the second dropdown select the remaining coins you want to play with up to 10 coins can be chosen depending on the game type.
Once finished an “Enter Game” button will appear Press that and your Metamask wallet will prompt you to complete the transaction to enter the game. The captain coin with a 1.2x multiplier combined with your other coins will make up your team, their percentages will be added together to make up your total score.
          </Typography>
        </Box>
        <Box display={'flex'} alignItems={'center'} p={2}>
          <Typography variant='body1' component={'p'}>
            The game will not start until all players needed have entered.
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box display={'flex'} alignItems={'center'} p={2}>
          <img
            src={'/images/coinleagues/howtoplay/howtoplay-step5.png'}
            loading={'lazy'}
            style={{width: '100%'}}
            alt={'Steps'}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box display={'flex'} alignItems={'center'} p={2}>
          <Typography variant='body1' component={'p'}>
            Once the game has started the countdown timer will start and begin
            calculating your rank based on the percentage gain or loss for the
            coins you chose.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default HowToPlay;
