import React, {useCallback} from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import {
  Box,
  Button,
  Grid,
  makeStyles,
  Paper,
  Typography,
  useTheme,
} from '@material-ui/core';
import {useMobile} from 'hooks/useMobile';

import coinsLeagueBannerPath from 'assets/images/banners/coinsleague.svg';

import AddIcon from '@material-ui/icons/Add';

import ChampionCard from 'modules/CoinLeagues/components/champions/ChampionCard';
import EarlyAccessCounterCard from 'modules/CoinLeagues/components/champions/EarlyAccessCounterCard';
import MintChampionDialog from 'modules/CoinLeagues/components/champions/dialogs/MintChampionDialog';
import {useToggler} from 'hooks/useToggler';
import {useChampionMint} from 'modules/CoinLeagues/hooks/champions';

const useStyles = makeStyles((theme) => ({
  bannerBox: {
    borderRadius: theme.shape.borderRadius,
  },
  banner: {
    borderRadius: theme.shape.borderRadius,
  },
}));

export function ChampionsEvent() {
  const classes = useStyles();

  const theme = useTheme();

  const isMobile = useMobile();

  const mintDialogToggler = useToggler(true);

  const championMint = useChampionMint();

  const handleMintChampion = useCallback(() => {}, []);

  return (
    <>
      <MintChampionDialog
        dialogProps={{
          open: mintDialogToggler.show,
          onClose: mintDialogToggler.toggle,
        }}
      />
      <Box>
        <Grid container spacing={4} justifyContent='center'>
          <Grid item xs={12} sm={10}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Box
                  display='flex'
                  alignItems='center'
                  alignContent='center'
                  justifyContent='center'
                  className={classes.bannerBox}
                  boxShadow={3}>
                  <img className={classes.banner} src={coinsLeagueBannerPath} />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={4} alignItems='stretch'>
                  <Grid item xs={12} sm={4}>
                    <EarlyAccessCounterCard />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper style={{height: '100%'}}>
                      <Box p={4}>
                        <Typography color='textSecondary' variant='caption'>
                          <IntlMessages id='app.coinLeagues.normalAccess' />
                        </Typography>
                        <Typography variant='h4'>00:00:00</Typography>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper style={{height: '100%'}}>
                      <Box p={4}>
                        <Box>
                          <Typography color='textSecondary' variant='caption'>
                            <IntlMessages id='app.coinLeagues.yourBalance' />
                          </Typography>
                          <Typography variant='h4'>20 KIT</Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Paper>
                  <Box p={4}>
                    <Grid container spacing={4}>
                      <Grid item xs={12}>
                        <Typography gutterBottom variant='h5'>
                          <IntlMessages id='app.coinLeagues.round' /> 1
                        </Typography>
                        <Typography variant='body1'>
                          <IntlMessages id='coinLeagues.page.event.round.description' />
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Button
                          onClick={handleMintChampion}
                          fullWidth={isMobile}
                          startIcon={<AddIcon />}
                          variant='contained'
                          color='primary'>
                          <IntlMessages id='app.coinLeagues.createChampion' />
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Box
                      display='flex'
                      alignItems='center'
                      alignContent='center'
                      justifyContent='space-between'>
                      <Typography variant='h6'>
                        <IntlMessages id='app.coinLeagues.myChampions' />
                      </Typography>
                      <Button color='primary'>
                        <IntlMessages id='app.coinLeagues.viewMore' />
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <ChampionCard loading />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default ChampionsEvent;
