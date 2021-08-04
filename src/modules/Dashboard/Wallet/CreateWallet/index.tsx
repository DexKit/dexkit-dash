import React, {useCallback, useEffect, useState} from 'react';

import * as bip39 from 'bip39';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Step from '@material-ui/core/Step';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import StepLabel from '@material-ui/core/StepLabel';
import Container from '@material-ui/core/Container';

import {makeStyles} from '@material-ui/core';

import InfoPage from './steps/InfoPage';
import Passphrase from './steps/Passphrase';
import MnemonicInsert from './steps/MnemonicInsert';
import GeneratedWallet from './steps/GeneratedWallet';
import MnemonicConfirm from './steps/MnemonicConfirm';
import MnemonicGeneration from './steps/MnemonicGeneration';
import { useHistory } from 'react-router-dom';

const mnemonicsGen = bip39.generateMnemonic().split(' ');
interface IStep {
  description: string;
  component: React.ReactElement;
}

const useStyles = makeStyles((theme) => ({
  buttons: {width: '100%', paddingBottom: 0, marginTop: theme.spacing(1)},
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const CreateBTCWallet: React.FC = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [allowStep, setAllowStep] = useState(true);
  const [passphrase, setPass] = useState<string>();
  const history = useHistory();
  const [hasSeed, setHasSeed] = useState(false);
  const [mnemonics, setMnemonics] = useState(mnemonicsGen);

  const goToWallet = useCallback(()=>{
    history.push('/dashboard/wallet')
  },[history])

  useEffect(() => {
    if (activeStep === 0) {
      setAllowStep(true);
      setHasSeed(false);
    }
  }, [activeStep]);

  useEffect(() => {
    if (hasSeed) handleNext();
    // eslint-disable-next-line
  }, [hasSeed]);

  const steps: IStep[] = [
    {
      description: 'Procedure information',
      component: <InfoPage setHasSeed={setHasSeed} />,
    },
    {
      description: 'Mnemonic info',
      component: hasSeed ? (
        <MnemonicInsert
          setAllowStep={setAllowStep}
          setMnemonics={setMnemonics}
        />
      ) : (
        <MnemonicGeneration
          setAllowStep={setAllowStep}
          mnemonics={mnemonicsGen}
        />
      ),
    },
    {
      description: 'Mnemonic confirmation',
      component: (
        <MnemonicConfirm mnemonics={mnemonics} setAllowStep={setAllowStep} />
      ),
    },
    {
      description: 'Passphrase creation',
      component: <Passphrase setAllowStep={setAllowStep} setPass={setPass} />,
    },
    {
      description: 'Result of generated wallet',
      component: (
        <GeneratedWallet mnemonics={mnemonics} passphrase={passphrase} />
      ),
    },
  ];

  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleNext = () =>
    activeStep + 1 >= steps.length
      ? setActiveStep(0)
      : setActiveStep((prev) => prev + 1);

  return (
    <div className={classes.container}>
      <Container maxWidth='lg'>
        <Card component={Paper}>
          <Stepper activeStep={activeStep} style={{height: '100%'}}>
            {steps.map((step, i) => (
              <Step key={i}>
                <StepLabel>{step.description}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box className={classes.container} style={{height: '55vh'}}>
            {steps[activeStep].component}
          </Box>
          <div className={classes.buttons}>
            {activeStep === steps.length - 1 ? (
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  paddingTop: '17vh',
                }}>
                <Box style={{flex: '1 1 auto'}} />
                <Button onClick={goToWallet}>FINISH</Button>
              </Box>
            ) : (
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  paddingTop: '15vh',
                }}>
                <Button
                  color='inherit'
                  disabled={activeStep === 0}
                  onClick={handleBack}>
                  BACK
                </Button>
                <Box style={{flex: '1 1 auto', textAlign: 'center'}}>
                  <Button color='primary' onClick={() => history.goBack()}>
                    EXIT
                  </Button>
                </Box>
                <Button onClick={handleNext} disabled={!allowStep}>
                  {activeStep === steps.length - 1 ? 'FINISH' : 'NEXT'}
                </Button>
              </Box>
            )}
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default CreateBTCWallet;
