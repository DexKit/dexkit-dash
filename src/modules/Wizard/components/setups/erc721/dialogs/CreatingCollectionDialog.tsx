import React, {useState, useCallback, useEffect} from 'react';
import {
  DialogProps,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Grid,
  BackdropProps,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepIcon,
  StepContent,
  makeStyles,
  useTheme,
  CircularProgress,
  Button,
  IconButton,
  Link,
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import HelpIcon from '@material-ui/icons/Help';

import {ContractStatus} from 'modules/Wizard/types';

import ImageIcon from '@material-ui/icons/Image';
import InfoIcon from '@material-ui/icons/Info';

import AssignmentIcon from '@material-ui/icons/Assignment';
import GavelIcon from '@material-ui/icons/Gavel';
import {useWeb3} from 'hooks/useWeb3';
import {getTransactionScannerUrl} from 'utils/blockchain';
import {useHistory} from 'react-router';

interface CreatingCollectionBackdropProps extends DialogProps {
  step: ContractStatus;
  contractAddress?: string;
  contractTransaction?: string;
  mintTransaction?: string;
}

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export const CreatingCollectionDialog = (
  props: CreatingCollectionBackdropProps,
) => {
  const {step, contractAddress, contractTransaction, mintTransaction} = props;

  const classes = useStyles();

  const theme = useTheme();

  const {chainId} = useWeb3();

  const history = useHistory();

  const handleGoCollection = useCallback(() => {
    if (contractAddress) {
      history.push(`/wizard/collection/${contractAddress}`);
    }
  }, [history, contractAddress]);

  return (
    <Dialog {...props}>
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
              Upload images
            </StepLabel>
            <StepContent>
              <Typography gutterBottom variant='h5'>
                Uploading images
              </Typography>
              <Typography variant='body1'>
                We are storing your collection images in a decentralized
                storage.
                <Link href='https://ipfs.io/' target='_blank'>
                  <HelpIcon color='inherit' /> Learn more
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
              Send metadata
            </StepLabel>
            <StepContent>
              <Typography gutterBottom variant='h5'>
                Sending collection metadata
              </Typography>
              <Typography gutterBottom variant='body1'>
                We are storing your collection information in a decentralized
                storage.
                <Link href='https://ipfs.io/' target='_blank'>
                  <HelpIcon color='inherit' /> Learn more
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
              Create collection
            </StepLabel>
            <StepContent>
              <Typography gutterBottom variant='h5'>
                Creating the Collection
              </Typography>
              <Typography gutterBottom variant='body1'>
                Please, sign the transaction in your wallet and wait for
                confirmation, this could take longer to complete.
              </Typography>
              {contractTransaction && chainId ? (
                <Button
                  color='primary'
                  href={getTransactionScannerUrl(chainId, contractTransaction)}
                  target='_blank'>
                  View transaction
                </Button>
              ) : null}
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
              Mint items
            </StepLabel>
            <StepContent>
              <Typography gutterBottom variant='h5'>
                Minting items
              </Typography>
              <Typography gutterBottom variant='body1'>
                Please, sign the transaction in your wallet and wait for
                confirmation, this could take longer to complete.
              </Typography>
              {mintTransaction && chainId ? (
                <Button
                  color='primary'
                  href={getTransactionScannerUrl(chainId, mintTransaction)}
                  target='_blank'>
                  View transaction
                </Button>
              ) : null}
            </StepContent>
          </Step>
          <Step>
            <StepLabel icon={<CheckCircleIcon />}>Finalize</StepLabel>
            <StepContent>
              <Typography gutterBottom variant='h5'>
                Collection created
              </Typography>
              <Typography gutterBottom variant='body1'>
                Collection created successfully. Access your collection to edit
                and add new items.
              </Typography>
              <Button onClick={handleGoCollection} color='primary'>
                View Collection
              </Button>
            </StepContent>
          </Step>
        </Stepper>
      </DialogContent>
    </Dialog>
  );
};

export default CreatingCollectionDialog;
