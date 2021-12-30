import React, {useCallback} from 'react';
import {
  DialogProps,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  makeStyles,
  useTheme,
  CircularProgress,
  Button,
  IconButton,
  Link,
  Box,
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import HelpIcon from '@material-ui/icons/Help';
import CloseIcon from '@material-ui/icons/Close';
import NoteAddIcon from '@material-ui/icons/NoteAdd';

import {ContractStatus} from 'modules/Wizard/types';

import ImageIcon from '@material-ui/icons/Image';
import InfoIcon from '@material-ui/icons/Info';

import AssignmentIcon from '@material-ui/icons/Assignment';
import GavelIcon from '@material-ui/icons/Gavel';
import {useWeb3} from 'hooks/useWeb3';
import {getTransactionScannerUrl} from 'utils/blockchain';
import {useHistory} from 'react-router';
import clsx from 'clsx';
import ReplayIcon from '@material-ui/icons/Replay';
import IntlMessages from '@crema/utility/IntlMessages';
import CustomDialogTitle from 'shared/components/CustomDialogTitle';
import { useIntl } from 'react-intl';

interface CreatingCollectionBackdropProps extends DialogProps {
  step: ContractStatus;
  contractAddress?: string;
  contractTransaction?: string;
  mintTransaction?: string;
  skipMinting?: boolean;
  createError?: string;
  mintError?: string;
  onTryCreateCollectionAgain?: () => void;
  onTryMintAgain?: () => void;
}

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  icon: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
}));

export const CreatingCollectionDialog = (
  props: CreatingCollectionBackdropProps,
) => {
  const {
    step,
    contractAddress,
    contractTransaction,
    mintTransaction,
    skipMinting,
    onClose,
    createError,
    mintError,
    onTryCreateCollectionAgain,
    onTryMintAgain,
  } = props;

  const classes = useStyles();

  const theme = useTheme();

  const {chainId} = useWeb3();

  const history = useHistory();

  const handleGoCollection = useCallback(() => {
    if (contractAddress) {
      history.push(`/wizard/collection/${contractAddress}`);
    }
  }, [history, contractAddress]);

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  }, [onClose]);
  const { messages } = useIntl();
  return (
    <Dialog {...props}>
      <CustomDialogTitle title={messages['app.wizard.createCollection']} icon={<NoteAddIcon className={clsx(classes.icon)} />} onClose={handleClose}/>
      
      <DialogContent>
        <Stepper activeStep={step} orientation='vertical'>
          <Step>
            <StepLabel
              icon={
                step === ContractStatus.UploadImages ? (
                  <CircularProgress size={theme.spacing(6)} />
                ) : (
                  <ImageIcon
                    color={
                      step > ContractStatus.UploadImages ? 'primary' : 'inherit'
                    }
                  />
                )
              }>
              <IntlMessages id='app.wizard.uploadImages' />
            </StepLabel>
            <StepContent>
              <Typography gutterBottom variant='h5'>
                <IntlMessages id='app.wizard.uploadingImages' />
              </Typography>
              <Typography variant='body1'>
                <IntlMessages id='app.wizard.weAreStoringYourCollectionImages' />
                <Link href='https://ipfs.io/' target='_blank'>
                  <HelpIcon color='inherit' />{' '}
                  <IntlMessages id='app.wizard.learnMore' />
                </Link>
              </Typography>
            </StepContent>
          </Step>
          <Step>
            <StepLabel
              icon={
                step === ContractStatus.UploadMetadata ? (
                  <CircularProgress size={theme.spacing(6)} />
                ) : (
                  <InfoIcon
                    color={
                      step > ContractStatus.UploadMetadata
                        ? 'primary'
                        : 'inherit'
                    }
                  />
                )
              }>
              <IntlMessages id='app.wizard.sendMetadata' />
            </StepLabel>
            <StepContent>
              <Typography gutterBottom variant='h5'>
                <IntlMessages id='app.wizard.sendingCollectionMetadata' />
              </Typography>
              <Typography gutterBottom variant='body1'>
                <IntlMessages id='app.wizard.weAreStoringYourCollectionInfo' />
                <Link href='https://ipfs.io/' target='_blank'>
                  <HelpIcon color='inherit' />{' '}
                  <IntlMessages id='app.wizard.learnMore' />
                </Link>
              </Typography>
            </StepContent>
          </Step>
          <Step>
            <StepLabel
              icon={
                step === ContractStatus.CreateCollection ? (
                  <CircularProgress size={theme.spacing(6)} />
                ) : (
                  <AssignmentIcon
                    color={
                      step > ContractStatus.UploadMetadata
                        ? 'primary'
                        : 'inherit'
                    }
                  />
                )
              }>
              <IntlMessages id='app.wizard.createCollection' />
            </StepLabel>
            <StepContent>
              <Box mb={2}>
                <Typography gutterBottom variant='h5'>
                  <IntlMessages id='app.wizard.creatingCollection' />
                </Typography>
                <Typography gutterBottom variant='body1'>
                  <IntlMessages id='app.wizard.pleaseSignTheTransactionInYourWalletAndWait' />
                </Typography>
                {createError ? (
                  <Typography gutterBottom variant='body1' color='error'>
                    {createError}
                  </Typography>
                ) : null}
              </Box>
              <Grid container spacing={2}>
                {createError ? (
                  <Grid item>
                    <Button
                      startIcon={<ReplayIcon />}
                      onClick={onTryCreateCollectionAgain}>
                      <IntlMessages id='app.wizard.tryAgain' />
                    </Button>
                  </Grid>
                ) : null}

                {contractTransaction && chainId ? (
                  <Grid item>
                    <Button
                      color='primary'
                      href={getTransactionScannerUrl(
                        chainId,
                        contractTransaction,
                      )}
                      target='_blank'>
                      <IntlMessages id='app.wizard.viewTransaction' />
                    </Button>
                  </Grid>
                ) : null}
              </Grid>
            </StepContent>
          </Step>
          <Step>
            <StepLabel
              icon={
                step === ContractStatus.Minting ? (
                  <CircularProgress size={theme.spacing(6)} />
                ) : (
                  <GavelIcon
                    color={
                      step > ContractStatus.Minting ? 'primary' : 'inherit'
                    }
                  />
                )
              }>
              <IntlMessages id='app.wizard.mintItems' />{' '}
              {skipMinting ? '(Skiped)' : null}
            </StepLabel>
            <StepContent>
              <Typography gutterBottom variant='h5'>
                <IntlMessages id='app.wizard.mintingItems' />
              </Typography>
              <Typography gutterBottom variant='body1'>
                <IntlMessages id='app.wizard.pleaseSignTheTransactionInYourWalletAndWait' />
              </Typography>
              {mintError ? (
                <Typography gutterBottom variant='body1' color='error'>
                  {mintError}
                </Typography>
              ) : null}
              <Grid container spacing={2}>
                {mintError ? (
                  <Grid item>
                    <Button onClick={onTryMintAgain}>
                      <IntlMessages id='app.wizard.tryAgain' />
                    </Button>
                  </Grid>
                ) : null}

                {mintTransaction && chainId ? (
                  <Grid item>
                    <Button
                      color='primary'
                      href={getTransactionScannerUrl(chainId, mintTransaction)}
                      target='_blank'>
                      <IntlMessages id='app.wizard.viewTransaction' />
                    </Button>
                  </Grid>
                ) : null}
              </Grid>
            </StepContent>
          </Step>
          <Step>
            <StepLabel icon={<CheckCircleIcon />}>
              <IntlMessages id='app.wizard.finalize' />
            </StepLabel>
            <StepContent>
              <Typography gutterBottom variant='h5'>
                <IntlMessages id='app.wizard.collectionCreated' />
              </Typography>
              <Typography gutterBottom variant='body1'>
                <IntlMessages id='app.wizard.collectionCreatedSuccessfully' />
              </Typography>
              <Button onClick={handleGoCollection} color='primary'>
                <IntlMessages id='app.wizard.viewCollection' />
              </Button>
            </StepContent>
          </Step>
        </Stepper>
      </DialogContent>
    </Dialog>
  );
};

export default CreatingCollectionDialog;
