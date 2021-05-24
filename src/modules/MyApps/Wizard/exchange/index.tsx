import React, { useCallback, useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { RouteComponentProps } from 'react-router-dom';

import GeneralForm from './generalForm';
import ThemeForm from '../shared/themeForm';
// import CollectionsForm from './collectionsForm';
import { ConfigFileExchange, CurrencyPairMetaData, GeneralConfig, SocialNetworks, TokenMetaData } from 'types/myApps';
// import { AppState } from 'redux/store';
// import { onGetConfigFile } from 'redux/actions/ConfigFile.actions';
import { GridContainer } from '@crema';
import { Breadcrumbs, Grid, Link } from '@material-ui/core';
import TokensForm from './tokensForm';
import PairsForm from './pairsForm';
import { SubmitComponent } from '../shared/submit';
import { ChainId } from 'types/blockchain';
import { useWeb3 } from 'hooks/useWeb3';
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


export enum WizardData{
  GENERAL = 'general',
  THEME = 'theme',
  TOKENS = 'tokens',
  PAIRS = 'pairs'
}

export interface WizardProps {
  form: ConfigFileExchange;
  //method to change form values
  changeIssuerForm: (key: keyof ConfigFileExchange, value: any) => void;
  validator: (isValid: boolean) => void;
  isValid: boolean;
}

function getSteps() {
  return ['Select  App', 'Configure APP', 'Tokens', 'Pairs and Deploy'];
}

function getStepContent(step: number, label: string, wizardProps: WizardProps, chainId: ChainId) {
  const {form, changeIssuerForm, validator, isValid} = wizardProps;
  const k = Object.values(WizardData)[step];
  const data = form[k];
  switch (step) {
    case 0:
      const fields: GeneralConfig = data as GeneralConfig;
      return (
        <GeneralForm 
          title={label}
          fields={fields} 
          changeIssuerForm={changeIssuerForm}
          validator={validator}
          form={form}
          isValid={isValid}
        />
      )
    case 1:
      const themeName = form?.theme_name ?? '';
      return <ThemeForm themeName={themeName}/>;
    case 2: {
      const tokens: TokenMetaData[] = data as TokenMetaData[];
      return (
        <TokensForm
          key={"tokensForm"} 
          title={label} 
          tokens={ tokens ?? []}
          changeIssuerForm={changeIssuerForm}
          validator={validator}
          form={form}
          isValid={isValid}
          chainId={chainId}
        />
      );
    }
   case 3:{
      const pairs: CurrencyPairMetaData[] = data as CurrencyPairMetaData[];
      return (
        <PairsForm 
        title={label} 
        pairs={ pairs ?? []}
        changeIssuerForm={changeIssuerForm}
        validator={validator} 
        form={form}
        isValid={isValid}
        chainId={chainId}
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

type ExchangeParams = {
};

type ExchangeProps = RouteComponentProps<ExchangeParams>;

const initSocial = {
    telegram_url: '',
    twitter_url: '',
    facebook_url: '',
    discord_url: '',
    reddit_url: '',
    bitcointalk_url: ''
} as SocialNetworks;

const initConfig = {
  // collections: [],
  // tokens: [],
  general: {
    social: initSocial
  },
  theme: undefined
} as ConfigFileExchange;

export default function VerticalLinearStepper(props: ExchangeProps) {
  const {match: { params }, history } = props;
  const [form, setForm] = useState({ ...initConfig } as ConfigFileExchange) ;
  const [isValid, setValid] = useState(false);
  const { chainId } = useWeb3();
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  // const dispatch = useDispatch();
  useEffect(() => {
    console.log('exchange loaded');
  }, []);

  const updateForm = useCallback(
    (key: keyof ConfigFileExchange, value: any) => {
      console.log('updateForm', {key, value});
      const dataType = Object.values(WizardData).find( e => e === key);
      if(dataType != null){
        console.log('updateForm', dataType);
        form[key] = value;
        setForm(form);
      }
    }
    , [form, setForm]);

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
  }, []);

  return (
    <div className={classes.root}>

      <GridContainer>
        <Grid item xs={12} md={12}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" onClick={()=> history.push('/my-apps/manage')}>My Apps</Link>
            <Typography color="textPrimary">Wizard</Typography>
          </Breadcrumbs>
          <Typography variant="h4" color="textPrimary">EXCHANGE</Typography>
        </Grid>
      </GridContainer>

      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              {getStepContent(activeStep, label, { form, changeIssuerForm: updateForm, validator, isValid }, (chainId ?? ChainId.Mainnet))}
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
            data={form}
            text="Submit"
            valid={isValid}
            type={'DEX'}
          />
        </Paper>
      )}
    </div>
  );
}