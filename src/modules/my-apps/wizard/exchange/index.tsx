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
import { Collection } from '@types';
import { AppState } from 'redux/store';
import { onGetConfigFile } from 'redux/actions/ConfigFile.actions';

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
  return ['Select  App', 'Configure APP', 'Confirm and Deploy'];
}

export enum WizardData{
  CONTACT= 'contact',
  THEME = 'theme',
  COLLECTIONS = 'collections'
}

function getStepContent(step: number, label: string, wizardProps: WizardProps) {
  const {form, changeIssuerForm} = wizardProps;
  switch (step) {
    case 0:
      return <GeneralForm title={label} />;
    case 1:
      return <ThemeForm themeName={'Tema teste'}/>;
    case 2:{
      const data = form.get(Object.values(WizardData)[step])?.valueOf() as string;
      const collections: Collection[] = JSON.parse(data) as Collection[];
      return (
        <CollectionsForm 
        title={label} 
        collections={ collections ?? []} 
        changeIssuerForm={changeIssuerForm}
        form={form}
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

export interface WizardProps {
  form: FormData;
  //method to change form values
  changeIssuerForm: (key: string, value: any) => void;
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

const SubmitComponent: React.FC<SubmitProps> = (props) => {
  const classes = useStyles();
  const [isLoading, setLoading] = useState(false);
  const { data } = props;
  const submit = ($event: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => {
    //send data
    if(!isLoading){
      setLoading(true);
      setTimeout(function(){
        console.log('sucess!', data);
        setLoading(false);
      },2000);
    }
  }
  return (
    <Button
      disabled={isLoading}
      variant="contained"
      color="primary"
      onClick={submit}
      className={classes.button}
    >
      Submit
    </Button>
  )
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
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const dispatch = useDispatch();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

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
    dispatch(onGetConfigFile());
  }, [ dispatch ]);

  useEffect(() => {
    Object.values(WizardData)
    .forEach( t => form.append(t, '[]'));
    setForm(form);
  }, []);

  const { configFile } = useSelector<AppState, AppState['configFile']>(
    ({ configFile }) => configFile
  );

  console.log('configFile', configFile);

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              {getStepContent(activeStep, label, { form, changeIssuerForm: updateForm })}
              <ButtonNavigation
                ButtonBackText="Back"
                ButtonNextText={activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                handleBack={activeStep === 0 ? undefined : handleBack}
                handleNext={activeStep >= steps.length ? undefined : handleNext} />
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
          <SubmitComponent data={form} />
        </Paper>
      )}
    </div>
  );
}
