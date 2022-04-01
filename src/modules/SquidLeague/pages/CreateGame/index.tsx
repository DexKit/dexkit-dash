import IntlMessages from '@crema/utility/IntlMessages';
import {
  Grid,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import {useFormik} from 'formik';
import {useNotifications} from 'hooks/useNotifications';
import {useToggler} from 'hooks/useToggler';
import {useWeb3} from 'hooks/useWeb3';
import CreateGameDialog from 'modules/SquidLeague/components/dialogs/CreateGameDialog';
import {useSquidGameFactoryCallbacks} from 'modules/SquidLeague/hooks/useSquidGameFactoryCallbacks';
import React, {useCallback, useState} from 'react';
import {useIntl} from 'react-intl';
import MainLayout from 'shared/components/layouts/main';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import {useChainInfo} from 'hooks/useChainInfo';

import * as yup from 'yup';
import {BigNumber, ethers} from 'ethers';

const useStyles = makeStyles((theme) => ({
  bold: {
    fontWeight: 600,
  },
}));

const formSchema = yup.object().shape({
  entryAmount: yup.number().min(0.0001).max(100000).required(),
  startsAt: yup.string().required(),
});

interface GameParams {
  entryAmount: number;
  startsAt: string;
}

export const CreateGamePage = () => {
  const classes = useStyles();

  const {formatMessage} = useIntl();
  const createGameToggler = useToggler(false);
  const {chainId} = useWeb3();
  const {createNotification} = useNotifications();
  const [confirmedCreateGame, setConfirmedCreatedGame] = useState(false);
  const [transaction, setTransaction] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [loadingCreatingGame, setLoadingCreatingGame] = useState(false);
  const {getTransactionScannerUrl} = useChainInfo();
  const {onCreateSquidCallback} = useSquidGameFactoryCallbacks();

  const handleSubmit = useCallback(
    (values) => {
      console.log(values);
      createGameToggler.toggle();
    },
    [createGameToggler],
  );

  const formik = useFormik<GameParams>({
    initialValues: {
      entryAmount: 0.0001,
      startsAt: '',
    },
    validationSchema: formSchema,
    onSubmit: handleSubmit,
  });

  const handleReset = useCallback(() => {
    setConfirmedCreatedGame(false);
    setTransaction('');
    setErrorMessage(undefined);
  }, []);

  const handleCloseCreateGameDialog = useCallback(() => {
    createGameToggler.toggle();
    handleReset();
  }, [createGameToggler]);

  const onConfirmCreateGameCallback = useCallback(() => {
    if (!chainId) {
      return;
    }

    setLoadingCreatingGame(true);
    const onConfirm = () => {
      setLoadingCreatingGame(false);
      setConfirmedCreatedGame(true);
    };
    const onSubmit = (tx: string) => {
      setTransaction(tx);
      createNotification({
        title: formatMessage({
          id: 'squidLeague.createGameTitle',
          defaultMessage: `Create Squid Game`,
        }),
        body: formatMessage({
          id: 'squidLeague.createGameBody',
          defaultMessage: `Create Squid Game`,
        }),
        timestamp: Date.now(),
        url: getTransactionScannerUrl(chainId, tx),
        urlCaption: formatMessage({
          id: 'squidLeague.viewTx',
          defaultMessage: 'View Tx',
        }),
        type: NotificationType.TRANSACTION,
        metadata: {
          chainId: chainId,
          transactionHash: tx,
          status: 'pending',
        } as TxNotificationMetadata,
      });
    };
    const onError = (error: any) => {
      setLoadingCreatingGame(false);
      setErrorMessage(error);
    };

    onCreateSquidCallback(
      {
        startTimestamp: BigNumber.from(
          Math.floor(new Date(formik.values.startsAt).getTime() / 1000),
        ),
        pot: ethers.utils.parseEther(String(formik.values.entryAmount)),
      },
      {
        onConfirmation: onConfirm,
        onSubmit: onSubmit,
        onError,
      },
    );
  }, [
    getTransactionScannerUrl,
    chainId,
    formik.values,
    createNotification,
    onCreateSquidCallback,
    formatMessage,
  ]);

  return (
    <MainLayout>
      <CreateGameDialog
        errorMessage={errorMessage}
        transactionHash={transaction}
        loading={loadingCreatingGame}
        confirmed={confirmedCreateGame}
        onConfirm={onConfirmCreateGameCallback}
        dialogProps={{
          open: createGameToggler.show,
          maxWidth: 'sm',
          fullWidth: true,
          onClose: handleCloseCreateGameDialog,
        }}
      />

      <Grid container spacing={4}>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}>
          <Box p={4} component={Paper}>
            <Typography
              className={classes.bold}
              color='textPrimary'
              variant='subtitle1'>
              <IntlMessages
                id='squidLeague.SquidLeague'
                defaultMessage={'Squid League'}
              />
            </Typography>
            <Typography color='textSecondary' variant='body1'>
              <IntlMessages
                id='squidLeague.SquidLeagueDescription'
                defaultMessage={'Join the Squid Game'}
              />
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography
            className={classes.bold}
            color='textPrimary'
            variant='subtitle1'>
            <IntlMessages
              id='squidLeague.createGame'
              defaultMessage={'Create Game'}
            />
          </Typography>
          <Typography color='textSecondary' variant='body1'>
            <IntlMessages
              id='squidLeague.setTheParametersOfTheGame'
              defaultMessage={'Set Game Parameters'}
            />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <TextField
                label={formatMessage({
                  id: 'squidLeague.entryAmount',
                  defaultMessage: `Entry Amount`,
                })}
                value={formik.values.entryAmount}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.entryAmount)}
                helperText={
                  Boolean(formik.errors.entryAmount) &&
                  formik.errors.entryAmount
                }
                name='entryAmount'
                variant='outlined'
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label={formatMessage({
                  id: 'squidLeague.startsAt',
                  defaultMessage: `Starts At`,
                })}
                value={formik.values.startsAt}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.startsAt)}
                helperText={
                  Boolean(formik.errors.startsAt) && formik.errors.startsAt
                }
                InputLabelProps={{
                  shrink: true,
                }}
                name='startsAt'
                type='datetime-local'
                variant='outlined'
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={handleSubmit}
            disabled={!formik.isValid}
            variant='contained'
            color='primary'>
            <IntlMessages
              id='squidLeague.createGame'
              defaultMessage={'Create Game'}
            />
          </Button>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default CreateGamePage;
