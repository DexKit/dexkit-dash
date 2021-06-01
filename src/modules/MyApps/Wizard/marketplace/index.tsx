import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

import GeneralForm from './generalForm';
import ThemeForm from '../shared/themeForm';
import CollectionsForm from './collection/collectionsForm';

import { 
  Collection, 
  ConfigFileMarketplace, 
  GeneralConfig, 
  SocialNetworks, 
  TokenMetaData
} from 'types/myApps';
import { GridContainer } from '@crema';
import { Box, Breadcrumbs, Grid, IconButton, Link } from '@material-ui/core';

import { RouteComponentProps } from 'react-router-dom';
 import { useMyAppsConfig } from 'hooks/myApps/useMyAppsConfig';
import { useWeb3 } from 'hooks/useWeb3';
import { SubmitComponent } from '../shared/submit';
import { ChainId } from 'types/blockchain';
import { NavigationButton } from '../shared/navigationButton';
import LoadingView from 'modules/Common/LoadingView';
import TokensForm from './token/tokensForm';


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
  form: ConfigFileMarketplace;
  //method to change form values
  changeIssuerForm: (key: keyof ConfigFileMarketplace | 'editable', value: any) => void;
  validator: (isValid: boolean) => void;
  isValid: boolean;
  editable?: boolean
}

function getSteps() {
  return ['General',  'Theme', 'Collections', 'Tokens and Deploy'];
}

function getStepContent(step: number, label: string, wizardProps: WizardProps, chainId: ChainId) {
  const {form, changeIssuerForm, validator, isValid, editable } = wizardProps;
  const k = Object.values(WizardData)[step];
  const data = form[k];
  switch (step) {
    case 0: {
      const fields: GeneralConfig = data as GeneralConfig;
      console.log(`getStepContent.editable(${step})`, editable);
      return (
        <GeneralForm
          key={'generalForm'} 
          title={label}
          fields={fields} 
          changeIssuerForm={changeIssuerForm}
          validator={validator}
          form={form}
          isValid={isValid}
          editable={editable}
        />
      )
    }
    case 1:
      const themeName = form?.theme_name ?? '';
      const theme = form?.theme;
      return (<ThemeForm 
        themeName={themeName}
        theme={theme}
        changeIssuerForm={changeIssuerForm}
        editable={editable}
      />);
    case 2:{
      const collections: Collection[] = data as Collection[];
      return (
        <CollectionsForm 
        key={'collectionsForm'}
        title={label} 
        collections={ collections ?? []}
        changeIssuerForm={changeIssuerForm}
        validator={validator} 
        form={form}
        isValid={isValid}
        editable={editable}
        />
      );
    }
    case 3: {
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
          editable={editable}
        />
      );
    }
    default:
      return ( <Typography>{ 'Unknown step' }</Typography> )
  }

}

type MarketplaceParams = {
  slug: string;
};

type MarketplaceProps = RouteComponentProps<MarketplaceParams>;
const initSocial = {
  facebook_url: '',
  reddit_url: '',
  twitter_url: '',
  telegram_url: '',
  discord_url: '',
  bitcointalk_url: '',
  youtube_url: '',
  medium_url: ''
} as SocialNetworks;

const initConfig = {
  // collections: [],
  // tokens: [],
  general: {
    social: initSocial
  },
  theme: undefined
} as ConfigFileMarketplace;

export default function VerticalLinearStepper(props: MarketplaceProps) {
  const {match: { params }, history } = props;
  const { slug } = params;

  const classes = useStyles();

  const [form, setForm] = useState({ } as ConfigFileMarketplace);
  const [isValid, setValid] = useState(false);
  // const [editable, setEditable] = React.useState(Boolean(slug));
  const [editable, setEditable] = React.useState(true);
  const [preview, setPreview] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);

  const { account, chainId } = useWeb3();
  const {configs, loading} = useMyAppsConfig(account);

  const steps = getSteps();

  const updateForm = useCallback(
    (key: keyof ConfigFileMarketplace | 'editable', value: any) => {
      const dataType = Object.values(WizardData).find( e => e === key);
      if(dataType != null && key != 'editable'){
        form[key] = value;
        setForm(form);
      } else if(key == 'editable'){
        setEditable(Boolean(value))
      }
    }
    , [form, setForm, setEditable]);

    useEffect(() => {
      if(editable && configs != null){
        const index = configs.findIndex( 
          (c,i) => c.type === 'MARKETPLACE' && 
          c.slug?.toLowerCase() === slug?.toLowerCase() && 
          configs[i]?.config != null
        );
        if(index >= 0){
          const config: ConfigFileMarketplace = JSON.parse(configs[index].config);
          setForm(config);
        }
        else {
          setForm({ ...initConfig });
        }
      } else if(loading){
        setForm({ ...initConfig });
      }
    }, [slug, configs]);

    useEffect(() => {
      if(preview){
        setEditable(false);
      }
      else {
        setEditable(true);
      }
    }, [preview])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if(preview)
      setEditable(false);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    if(preview)
      setEditable(false);
  };

  const handleReset = () => {
    setPreview(true);
    setTimeout(() => setActiveStep(0), 500);
  };

  const validator = useCallback((_isValid: boolean) => {
    setValid(_isValid);
  }, [setValid]);

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
        {steps.map((label, i) => (
          <Step key={label}>
            <StepLabel>
              {label}
              {
                activeStep === i && preview &&
                <IconButton 
                  aria-label="edit" 
                  color="primary"
                  onClick={() => setEditable(true)}
                  disabled={Boolean(editable)}
                >
                  <EditOutlinedIcon />
                </IconButton>
              } 
            </StepLabel>
            <StepContent>
              { 
                loading === false && form && Object.keys(form).length > 0 ?
                getStepContent(
                  activeStep, 
                  label, 
                  { form , changeIssuerForm: updateForm, validator, isValid, editable }, 
                  (chainId ?? ChainId.Mainnet)
                ) : 
                ( 
                  <Box m="auto" padding="5rem" textAlign="center">
                    <LoadingView />
                  </Box> 
                )
              }
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
          <Button onClick={handleReset} className={classes.button}>Review</Button>
          <SubmitComponent 
            data={form}
            text="Submit"
            valid={isValid}
            type={'MARKETPLACE'}
          />
        </Paper>
      )}
    </div>
  );
}
