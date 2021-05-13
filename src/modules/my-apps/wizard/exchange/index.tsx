import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import GeneralForm from './generalForm';
import ThemeForm from './themeForm';
import CollectionsForm from './collectionsForm';
import { Collection, GeneralConfig, TokenMetaData } from '@types';
import { AppState } from 'redux/store';
import { onGetConfigFile } from 'redux/actions/ConfigFile.actions';
import { GridContainer } from '@crema';
import { Breadcrumbs, Grid, Link } from '@material-ui/core';
import TokensForm from './tokensForm';
import { SubmitComponent } from '../shared/submit';
import { useHistory } from 'react-router-dom';

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

function getSteps() {
  return ['Select  App', 'Configure APP', 'Tokens and Deploy'];
}

export enum WizardData{
  CONTACT= 'contact',
  THEME = 'theme',
  // COLLECTIONS = 'collections'
  TOKENS = 'tokens'
}

export interface WizardProps {
  form: FormData;
  //method to change form values
  changeIssuerForm: (key: string, value: any) => void;
  validator: (isValid: boolean) => void;
  isValid: boolean;
}

function getStepContent(step: number, label: string, wizardProps: WizardProps) {
  const {form, changeIssuerForm, validator, isValid} = wizardProps;
  const data = form.get(Object.values(WizardData)[step])?.valueOf() as string;
  switch (step) {
    case 0:
      const social = { 
        social: {
          telegram_url: '',
          twitter_url: '',
          facebook_url: '',
          discord_url: '',
          reddit_url: '',
          bitcointalk_url: ''
        }
      };
      const fields: GeneralConfig = JSON.parse(data || JSON.stringify(social)) as GeneralConfig;
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
      return <ThemeForm themeName={'Tema teste'}/>;
    // case 2:{
    //   const data = form.get(Object.values(WizardData)[step])?.valueOf() as string;
    //   const collections: Collection[] = JSON.parse(data) as Collection[];
    //   return (
    //     <CollectionsForm 
    //     title={label} 
    //     collections={ collections ?? []}
    //     changeIssuerForm={changeIssuerForm}
    //     validator={validator} 
    //     form={form}
    //     isValid={isValid}
    //     />
    //   );
    // }
    case 2: {
      const data = form.get(Object.values(WizardData)[step])?.valueOf() as string;
      const tokens: TokenMetaData[] = JSON.parse(data) as TokenMetaData[];
      return (
        <TokensForm
          key={"tokensForm"} 
          title={label} 
          tokens={ tokens ?? []}
          changeIssuerForm={changeIssuerForm}
          validator={validator}
          form={form}
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

interface SubmitProps{
  data: FormData | Object;
}

interface ButtonNavigationProps {
  handleBack?: ($event: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void;
  handleNext?: ($event: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void;
  ButtonNextText: string;
  ButtonBackText: string;
}


const ButtonNavigation: React.FC<ButtonNavigationProps> = (props) => {
  const { handleBack, handleNext, ButtonBackText, ButtonNextText } = props;
  const classes = useStyles();
  return (
    <div className={classes.actionsContainer}>
      <div>
        <Button
          disabled={handleBack == null}
          onClick={handleBack}
          className={classes.button}
        >
          {ButtonBackText}
        </Button>
        <Button
          disabled={handleNext == null}
          variant="contained"
          color="primary"
          onClick={handleNext}
          className={classes.button}
        >
          {ButtonNextText}
        </Button>
      </div>
    </div>
  )
}

export default function VerticalLinearStepper() {
  const [form, setForm] = useState(new FormData()) ;
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
    console.log('setValid', _isValid);
  }, []);

  const updateForm = useCallback(
    (key: string, value: any) => {
      const dataType = Object.values(WizardData).find( e => e === key);
      if(dataType != null){
        form.set(key, JSON.stringify(value));
        setForm(form);
      }
    }
    , [form, setForm]);


  useEffect(() => {
    Object.values(WizardData)
    .forEach( t => form.append(t, '[]'));
    setForm(form);
  }, []);

  const history = useHistory();


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
              {getStepContent(activeStep, label, { form, changeIssuerForm: updateForm, validator, isValid })}
              <ButtonNavigation
                ButtonBackText="Back"
                ButtonNextText={activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                handleBack={activeStep === 0 ? undefined : handleBack}
                handleNext={activeStep >= steps.length || !isValid ? undefined : handleNext} />
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
          <SubmitComponent data={form} type={'DEX'} />
        </Paper>
      )}
    </div>
  );
}