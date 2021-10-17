/* eslint-disable react/no-unescaped-entities */
import React, {useState} from 'react';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Step from '@material-ui/core/Step';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Divider from '@material-ui/core/Divider';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core';

import GeralStep from './Geral';
import ThemeStep from './Theme';
import LinksStep from './Links';

interface IStep {
  title: string;
  component: React.ReactElement;
}

const steps: IStep[] = [
  {title: 'Geral', component: <GeralStep />},
  {title: 'Theme', component: <ThemeStep />},
  {title: 'Links', component: <LinksStep />},
];

const useStyles = makeStyles(() => ({
  root: {},
  container: {},
  buttons: {},
}));

const AggregatorStepper: React.FC = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  const allowStep = true;

  const handleReset = () => setActiveStep(0);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleNext = () =>
    activeStep + 1 >= steps.length
      ? setActiveStep(0)
      : setActiveStep((prev) => prev + 1);

  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid item xs={12}>
        <Card component={Paper} style={{backgroundColor: '#252836'}}>
          <Stepper activeStep={activeStep} style={{height: '100%'}}>
            {steps.map((step, i) => (
              <Step key={i}>
                <StepLabel>{step.title}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Grid container spacing={2}>
            {steps[activeStep].component}
          </Grid>
          <Divider style={{marginLeft: 5, marginRight: 5, color: '#3A3D4A'}} />
          <div className={classes.buttons}>
            {activeStep === steps.length ? (
              <>
                <Typography>All steps completed - you're finished!</Typography>
                <Box
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    paddingTop: '17vh',
                  }}>
                  <Box style={{flex: '1 1 auto'}} />
                  <Button onClick={handleReset}>RESET</Button>
                </Box>
              </>
            ) : (
              <Grid container spacing={6} style={{margin: 10, marginLeft: 0}}>
                <Grid item xs={8} />
                <Grid item xs={4}>
                  <Grid container spacing={4}>
                    <Grid item xs={6} style={{textAlign: 'right'}}>
                      <Button
                        size='large'
                        variant='contained'
                        color='inherit'
                        disabled={activeStep === 0}
                        onClick={handleBack}>
                        BACK
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        size='large'
                        variant='contained'
                        onClick={handleNext}
                        disabled={!allowStep}
                        color='primary'>
                        {activeStep === steps.length - 1 ? 'SUBMIT' : 'NEXT'}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </div>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AggregatorStepper;
