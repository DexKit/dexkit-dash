import React, { useCallback, useState } from 'react';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Breadcrumbs, Grid, Link } from '@material-ui/core';

import { 
  ConfigFileAggregator, 
  GeneralConfigAggregator, 
  AggregatorLinks, 
  AggregatorWallet, 
  TokenFeeProgramConfig 
} from 'types/myApps';

import TokensForm from './token';
import GeneralForm from './general';
import ThemeForm from '../shared/themeForm';
import { GridContainer } from '@crema';
import { SubmitComponent } from '../shared/submit';
import { NavigationButton } from '../shared/navigationButton';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },

    resetContainer: {
      padding: theme.spacing(3),
    },
  }),
);


export enum WizardData {
  GENERAL = 'general',
  TOKENS = 'token_fee_program',
  CONTACT = 'links',
  WALLET = 'wallets',
}
export interface WizardProps {
  config: ConfigFileAggregator;
  //method to change form values
  changeIssuerForm: (key: WizardData, value: any) => void;
  validator: (isValid: boolean) => void;
  isValid: boolean;
}

function getSteps() {
  return ['General',  'Tokens', 'Links', 'Wallets and Deploy'];
}

const initConfig: GeneralConfigAggregator = {
  name: '',
  logo: '',
  logo_dark: '',
  domain: '',
  feeRecipient: '',
  buyTokenPercentage: '0',
  brand_color: '#FFFF',
  brand_color_dark: '#313541',
  support_bsc: false,
  bsc_as_default: false,
  fee_waive_for_default_token: false,
  is_dark_mode: false,
  hide_powered_by_dexkit: false,
  default_token_list: '',
  affiliateAddress: '',
  default_token_address: '',
  default_token_address_bsc: '',
};

function getStepContent(step: number, label: string, wizardProps: WizardProps) {
  const {config, changeIssuerForm, validator, isValid} = wizardProps;
  switch (step) {
    case 0:

      const data: ConfigFileAggregator = config != null && 'name' in config ? { ...config} as GeneralConfigAggregator : initConfig;
      type k = keyof typeof data;
      const _isValid = Object.keys(data).reduce((acu, cur) => acu && data[cur as k] == true, true);
      return (
      <GeneralForm 
        title={label}
        data={data}
        changeIssuerForm={changeIssuerForm}
        validator={validator}
        isValid={_isValid ?? isValid} 
      />
    );
    case 1:
      return <ThemeForm themeName={'Tema teste'}/>;
    case 2:{
      return (
        <TokensForm 
          title={label} 
          data={ config.token_fee_program ?? []} 
          changeIssuerForm={changeIssuerForm}
          config={config}
          validator={validator}
          isValid={isValid}
        />
      );
    }
    default:
      return (
        <Typography>
          {
            'Unknown step'
          }
        </Typography>
      )
  }

}

export default function VerticalLinearStepper() {
  const [data, setData] = useState<ConfigFileAggregator>({ ...initConfig});
  const [isValid, setValid] = useState(false);
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const validator = useCallback((_isValid: boolean) => {
    setValid(_isValid);
  }, [setValid]);

  const updateData = 
    (
      key: WizardData,
      value: GeneralConfigAggregator | TokenFeeProgramConfig[] | AggregatorLinks | AggregatorWallet
      // value: Partial<ConfigFileAggregator>
    ) => {
      const dataType = Object.values(WizardData).find( e => e === key);
      // console.log('updateData', data);
      switch(dataType){
        case WizardData.GENERAL: {
          if(data == null){
            setData({ ...value } as ConfigFileAggregator);
          } else{
            type k = keyof typeof value;
            Object.keys(value)
            .forEach( _key => {
              data[(_key as k)] = value[(_key as k)]
            });
            setData(data);
          }
          console.log('updateData', data);
          break;
        }
        case WizardData.CONTACT: 
        case WizardData.TOKENS:
        case WizardData.WALLET: {
          if(data != null){
            setData({
              ...data,
              [key]: value
            })
          }
        }
      };
    }

  return (
    <div className={classes.root}>

      <GridContainer>
        <Grid item xs={12} md={12}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/my-apps/exchange">My Apps</Link>
            <Typography color="textPrimary">Wizard</Typography>
          </Breadcrumbs>
          <Typography variant="h4" color="textPrimary">AGGREGATOR</Typography>
        </Grid>
      </GridContainer>


      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              {getStepContent(activeStep, label, { config: (data ?? {}) as ConfigFileAggregator, changeIssuerForm: updateData, validator, isValid })}
              <NavigationButton
                ButtonBackText="Back"
                ButtonNextText={activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                handleBack={activeStep === 0 ? undefined : handleBack}
                handleNext={activeStep >= steps.length || !isValid ? undefined : handleNext}
                classes={classes}
                />
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
          <SubmitComponent 
            data={(data ?? {}) as ConfigFileAggregator} 
            text="Submit"
            valid={isValid}
            type={'MARKETPLACE'}
          />
        </Paper>
      )}
    </div>
  );
}
