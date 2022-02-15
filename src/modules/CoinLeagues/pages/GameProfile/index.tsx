import React, {useState, useCallback} from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import {Breadcrumbs, Button, Grid, Link} from '@material-ui/core';

import Box from '@material-ui/core/Box';

import {Link as RouterLink} from 'react-router-dom';
import {HOME_ROUTE} from 'shared/constants/routes';

import {useMobile} from 'hooks/useMobile';
import {
  useGameProfileUpdater,
  useProfileGame,
} from 'modules/CoinLeagues/hooks/useGameProfile';
import {SubmitState} from 'modules/CoinLeagues/components/ButtonState';
import {useWeb3} from 'hooks/useWeb3';

const GameProfile = () => {
  const isMobile = useMobile();
  // eslint-disable-next-line
  const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.None);
  const {onPostMetadata} = useGameProfileUpdater();
  const {account} = useWeb3();

  const {refetch, data} = useProfileGame(account);

  const createGameProfile = useCallback(() => {
    setSubmitState(SubmitState.WaitingWallet);
    const onSubmitTx = (hash?: string) => {
      setSubmitState(SubmitState.Submitted);
    };
    const onConfirmTx = (hash?: string) => {
      // Save here the current id minted
      setSubmitState(SubmitState.Confirmed);
      refetch();
      setTimeout(() => {}, 2000);
    };
    const onError = (error?: any) => {
      setSubmitState(SubmitState.Error);
      setTimeout(() => {
        setSubmitState(SubmitState.None);
      }, 3000);
    };
    console.log('clicked');

    onPostMetadata(
      'test2',
      '0xf2a669a2749073e55c56e27c2f4edadb7bd8d95d',
      '1535',
      {
        onConfirmation: onConfirmTx,
        onError,
        onSubmit: onSubmitTx,
      },
    );
  }, [onPostMetadata, refetch]);

  return (
    <Grid container spacing={4} alignItems={'center'}>
      {/* {!isMobile && (
        <Grid item xs={12} sm={12} xl={12}>
          <Grid container>
            <Breadcrumbs>
              <Link color='inherit' component={RouterLink} to={HOME_ROUTE}>
                <IntlMessages id='app.coinLeagues.dashboard' />
              </Link>
            </Breadcrumbs>
          </Grid>
        </Grid>
      )}

      <Grid item xs={12} sm={6} xl={6}>
        <Box display={'flex'} alignItems={'end'} justifyContent={'end'}>
          <Button variant={'contained'} onClick={createGameProfile}>
            Create Profile
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12} sm={12} xl={12}>
        <Box display={'flex'}>{data?.username}</Box>
        <Box display={'flex'}>{data?.profileImage}</Box>
      </Grid> */}
    </Grid>
  );
};

export default GameProfile;
