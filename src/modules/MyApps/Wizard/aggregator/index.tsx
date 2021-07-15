import React, { useCallback, useEffect, useState } from 'react';
import { GridContainer } from '@crema';

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
  TokenFeeProgramConfig, 
  AggregatorTheme
} from 'types/myApps';
import { ChainId } from 'types/blockchain';

import { WizardProps } from '../shared';

import { SubmitComponent } from '../shared/Buttons/submit';
import { NavigationButton } from '../shared/Buttons/navigationButton';

import GeneralForm from './general';
import ThemeForm from './theme';
import LinksForm from './links';
import { useWeb3 } from 'hooks/useWeb3';
import { DefaultTheme } from '../shared/Theme';



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
  THEME = 'theme',
  CONTACT = 'links',
  WALLET = 'wallets',
}
// export interface WizardProps {
//   config: ConfigFileAggregator;
//   //method to change form values
//   changeIssuerForm: (key: WizardData, value: any) => void;
//   validator: (isValid: boolean) => void;
//   isValid: boolean;
//   editable?: boolean
// }

function getSteps() {
  // return ['General', 'Theme', 'Tokens', 'Links', 'Wallets and Deploy'];
  return ['General', 'Theme', 'Links'];
}

const defaultTheme = new DefaultTheme();

const initConfig: GeneralConfigAggregator = {
  name: '',
  logo: '',
  logo_dark: '',
  domain: '',
  feeRecipient: '0x5bD68B4d6f90Bcc9F3a9456791c0Db5A43df676d',
  buyTokenPercentage: '0.003',
  brand_color: "#ff7149",
  brand_color_dark: "#2172E5",
  support_bsc: true,
  bsc_as_default: false,
  matic_as_default: false,
  fee_waive_for_default_token: false,
  is_dark_mode: false,
  hide_powered_by_dexkit: false,
  default_token_list: 'https://tokens.coingecko.com/uniswap/all.json',
  affiliateAddress: '0x5bD68B4d6f90Bcc9F3a9456791c0Db5A43df676d',
  default_token_address: '0x7866E48C74CbFB8183cd1a929cd9b95a7a5CB4F4',
  default_token_address_bsc: '0x314593fa9a2fa16432913dbccc96104541d32d11',
  default_token_address_matic: '0x4d0def42cf57d6f27cd4983042a55dce1c9f853c',
  default_slippage: 1,
};

function getStepContent(step: number, label: string, wizardProps: WizardProps<ConfigFileAggregator, WizardData>, chainId: ChainId) {
  const {config, changeIssuerForm, validator, isValid, editable} = wizardProps;
  switch (step) {
    case 0:
      const data: ConfigFileAggregator = config != null && 'name' in config ? { ...config} as GeneralConfigAggregator : initConfig;
      type k = keyof typeof data;
      const _isValid = Object.keys(data).reduce((acu, cur) => acu && data[cur as k] == true, true);
      return (
      <GeneralForm 
        title={label}
        data={data}
        editable={editable}
        changeIssuerForm={changeIssuerForm}
        validator={validator}
        isValid={_isValid ?? isValid} 
      />
    );
    case 1:
      const theme: AggregatorTheme = {
        brand_color: config?.brand_color,
        brand_color_dark: config?.brand_color_dark,
        is_dark_mode: config?.is_dark_mode ?? true
      };
      return (<ThemeForm 
        theme={theme}
        changeIssuerForm={changeIssuerForm}
        editable={editable}
      />);
    case 2:{
      const data = config?.links ?? 
      {
        about: undefined,
        analytics: undefined,
        code: undefined,
        discord: undefined,
        docs: undefined,
        telegram: undefined
      } as AggregatorLinks;
      return (
        <LinksForm 
          changeIssuerForm={changeIssuerForm}
          data={data}
          config={config}
          validator={validator}
          isValid={isValid}
          editable={editable}
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
  const [editable, setEditable] = React.useState(true);
  const [preview, setPreview] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const { chainId } = useWeb3();

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

  useEffect(()=>{
    console.log(data);
  },[data])


  const updateData = 
    (
      key: WizardData | "editable",
      value: GeneralConfigAggregator | TokenFeeProgramConfig[] | AggregatorLinks | AggregatorWallet
    ) => {
      console.log(value);
      console.log(key);
      const dataType = Object.values(WizardData).find( e => e === key);
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
          break;
        }
        case WizardData.THEME: {
          if(data != null){
            const theme = value as AggregatorTheme;
            data.is_dark_mode = theme.is_dark_mode;
            data.brand_color = theme.brand_color;
            data.brand_color_dark = theme.brand_color_dark;
            setData(data);
          }
          break;
        }
        case WizardData.CONTACT: {
          if(data != null){
            data.links = value as AggregatorLinks;
            setData(data);
          }
          break;
        }
        case WizardData.TOKENS: {
          if(data != null){
            data.token_fee_program = value as TokenFeeProgramConfig[];
            setData(data);
          }
          break;
        }
        case WizardData.WALLET: {
          if(data != null){
            data.wallets = value as AggregatorWallet;
            setData(data);
          }
        }
      };
    }
   const [textButtonCopy, setTextButtonCopy] = useState('Copy Shortcode')

  const handleCopyShortcode = () => {
      setTextButtonCopy('Copied')
      let text = ''
      if(data.logo){
        text = `logo="${data.logo}"`
      }
      if(data.logo_dark){
        text = `${text} logo_dark="${data.logo_dark}"`
      }
      if(data.bsc_as_default){
          text = `${text} bsc_as_default="true"`
      }
      if(data.matic_as_default){
          text = `${text} matic_as_default="true"`
      }
      if(data.is_dark_mode){
          text = `${text} is_dark_mode="true"`
      }
      if(data.default_token_address){
          text = `${text} default_token_address_eth="${data.default_token_address}"`
      }
      if(data.default_token_address_bsc){
          text = `${text} default_token_address_bsc="${data.default_token_address_bsc}"`
      }
      if(data.default_token_address_matic){
          text = `${text} default_token_address_matic="${data.default_token_address_matic}"`
      }
      if(data.brand_color){
          text = `${text} brand_color="${data.brand_color}"`
      }
      if(data.brand_color_dark){
          text = `${text} brand_color_dark="${data.brand_color_dark}"`
      }
      if(data.default_slippage){
        text = `${text} default_slippage="${data.default_slippage}"`
    }
  
  
  
      const shortCodeToCopy = `[dexkit_aggregator ${text} ]`;
      navigator.clipboard.writeText(shortCodeToCopy);
      document.execCommand('copy');
      setTimeout(()=> {
        setTextButtonCopy('Copy Shortcode');
      }, 500)
  
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
              {
                getStepContent(
                  activeStep, 
                  label, 
                  { config: (data ?? {}) as ConfigFileAggregator, changeIssuerForm: updateData, validator, isValid, editable },
                  Number(chainId ?? ChainId.Mainnet)
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
          <Button onClick={handleReset} className={classes.button}>
             Reset
          </Button>
          <SubmitComponent 
            data={(data ?? {}) as ConfigFileAggregator} 
            text="Submit"
            valid={isValid}
            type={'AGGREGATOR'}
          />
        </Paper>
      )}
         <Paper square elevation={0} className={classes.resetContainer}>
          <Button onClick={handleCopyShortcode} className={classes.button} color="primary">
             {textButtonCopy}
          </Button>
        </Paper>
    </div>
  );
}
