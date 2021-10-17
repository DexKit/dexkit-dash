/* eslint-disable react/display-name */
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

import GeralStep from './Geral';
import ThemeStep from './Theme';
import LinksStep from './Links';

interface IStep {
  title: string;
  component: (props: any) => React.ReactElement;
}

const steps: IStep[] = [
  {title: 'Geral', component: (props) => <GeralStep {...props} />},
  {title: 'Theme', component: (props) => <ThemeStep {...props} />},
  {title: 'Links', component: (props) => <LinksStep {...props} />},
];

const initialValues = {
  geral: {
    name: '',
    logo: '',
    logoDark: '',
    buyTokenPerc: '0.003',
    domain: '',
    defaultToken: undefined,
    hidePoweredDexKit: false,
    affiliateAddr: '0x5bD68B4d6f90Bcc9F3a9456791c0Db5A43df676d',
    defaultTokenAddr: '0x7866E48C74CbFB8183cd1a929cd9b95a7a5CB4F4',
    defaultTokenAddrBSC: '0x314593fa9a2fa16432913dbccc96104541d32d11',
    defaultTokenAddrMatic: '0x4d0def42cf57d6f27cd4983042a55dce1c9f853c',
    defaultSlippage: 1,
  },
  theme: {
    defaultDarkMode: false,
    brandColor: '#ff7149',
    brandColorDark: '#2172E5',
  },
  links: {
    about: '',
    analytics: '',
    code: '',
    discord: '',
    docs: '',
    telegram: '',
  },
};

const AggregatorStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const [geralData, setGeralData] = React.useState(initialValues.geral);
  const [themeData, setThemeData] = React.useState(initialValues.theme);
  const [linksData, setLinksData] = React.useState(initialValues.links);

  const handleSubmit = () => {
    console.log({geralData, themeData, linksData});
  };

  const handleReset = () => setActiveStep(0);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleNext = () => {
    return activeStep + 1 >= steps.length
      ? handleSubmit()
      : setActiveStep((prev) => prev + 1);
  };

  const getStepData = (stepNum: number) => {
    const step = steps[stepNum];
    switch (step.title) {
      case 'Geral':
        return [geralData, setGeralData];
      case 'Theme':
        return [themeData, setThemeData];
      case 'Links':
        return [linksData, setLinksData];
      default:
        return [];
    }
  };

  return (
    <Grid container spacing={2}>
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
            {(() => {
              const [data, setData] = getStepData(activeStep);
              return steps[activeStep].component({data, setData});
            })()}
          </Grid>
          <Divider style={{marginLeft: 5, marginRight: 5, color: '#3A3D4A'}} />
          <Grid container>
            {activeStep === steps.length ? (
              <Grid container>
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
              </Grid>
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
                        color='primary'>
                        {activeStep === steps.length - 1 ? 'SUBMIT' : 'NEXT'}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AggregatorStepper;
