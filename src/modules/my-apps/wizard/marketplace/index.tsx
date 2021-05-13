import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
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
import TokensForm from './tokensForm';

import { Collection, GeneralConfig, TokenMetaData } from '@types';
import { GridContainer } from '@crema';
import { Breadcrumbs, Grid, Link } from '@material-ui/core';

import { useWeb3 } from 'hooks/useWeb3';


import { RouteComponentProps, useHistory } from 'react-router-dom';
import { useMyAppsConfig } from 'hooks/myApps/useMyAppsConfig';
import CoinStats from 'modules/dashboard/Token/Coins/CoinStats';
import { SubmitComponent } from '../shared/submit';




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
  THEME = 'theme',
  COLLECTIONS = 'collections',
  TOKENS = 'tokens'
}

export interface WizardProps {
  form: FormData;
  //method to change form values
  changeIssuerForm: (key: string, value: any) => void;
  validator: (isValid: boolean) => void;
  isValid: boolean;
}



interface ButtonNavigationProps {
  handleBack?: ($event: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void;
  handleNext?: ($event: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void;
  ButtonNextText: string;
  ButtonBackText: string;
}

function getSteps() {
  return ['General',  'Theme', 'Collections', 'Tokens and Deploy'];
}

function getStepContent(step: number, label: string, wizardProps: WizardProps) {
  const {form, changeIssuerForm, validator, isValid} = wizardProps;
  const data = form.get(Object.values(WizardData)[step])?.valueOf() as string;

  switch (step) {
    case 0: {

      const social = { 
        social: {
          facebook_url: '',
          reddit_url: '',
          twitter_url: '',
          telegram_url: '',
          discord_url: '',
          bitcointalk_url: '',
          youtube_url: '',
          medium_url: ''
        }
      };

      const fields: GeneralConfig = JSON.parse(data || JSON.stringify(social)) as GeneralConfig;
      return (
        <GeneralForm
          key={'generalForm'} 
          title={label}
          fields={fields} 
          changeIssuerForm={changeIssuerForm}
          validator={validator}
          form={form}
          isValid={isValid}
        />
      )
    }
    case 1:
      return <ThemeForm themeName={''}/>;
    case 2:{
      const collections: Collection[] = JSON.parse(data) as Collection[];
      return (
        <CollectionsForm 
          key={'collectionsForm'}
          title={label} 
          collections={ collections ?? []}
          changeIssuerForm={changeIssuerForm}
          validator={validator} 
          form={form}
          isValid={isValid}
        />
      );
    }
    case 3: {
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
     break;
  }

}



const ButtonNavigation: React.FC<ButtonNavigationProps> = (props) => {
  const { handleBack, handleNext, ButtonBackText, ButtonNextText } = props;
  const classes = useStyles();
  return (
    <div className={classes.actionsContainer}>
      <div>
        <Button disabled={handleBack == null} onClick={handleBack} className={classes.button}>{ButtonBackText}</Button>
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

type MarketplaceParams = {
  slug: string;
};

type MarketplaceProps = RouteComponentProps<MarketplaceParams >

export default function VerticalLinearStepper(props: MarketplaceProps) {
  const {match: { params }} = props;
  const { slug } = params;
  const { account } = useWeb3();
  const { configs } = useMyAppsConfig(account)


  const [form, setForm] = useState(new FormData());
  const [isValid, setValid] = useState(false);
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const dispatch = useDispatch();

  useEffect(() => {
    Object.values(WizardData)
    .forEach( t => form.append(t, '[]'));
    setForm(form);
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

  useEffect(()=> {
    if(slug && configs){
      const configResponseString = configs.find(c=> c.slug === slug);
      if(configResponseString){
        const config = JSON.parse(configResponseString.config)
        const keys = Object.values(WizardData);
        keys.forEach(k => {
          if(config[k]){
            updateForm(k, config[k] );
          }
        })
        
      }
    }
  }, [slug, configs])


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
  const history = useHistory();


  /*useEffect(() => {
    dispatch(onGetConfigFile());
  }, [ dispatch ]);*/

 

  // const { configFile } = useSelector<AppState, AppState['configFile']>(
  //   ({ configFile }) => configFile
  // );

  return (
    <div className={classes.root}>

      <GridContainer>
        <Grid item xs={12} md={12}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" onClick={()=> history.push('/my-apps/manage')}>My Apps</Link>
            <Typography color="textPrimary">Wizard</Typography>
          </Breadcrumbs>
          <Typography variant="h4" color="textPrimary">MARKETPLACE {slug ? `- Editing ${slug}` : ''}</Typography>
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
          <Button onClick={handleReset} className={classes.button}>Review</Button>
          <SubmitComponent data={form} type={'MARKETPLACE'}/>
        </Paper>
      )}
    </div>
  );
}
