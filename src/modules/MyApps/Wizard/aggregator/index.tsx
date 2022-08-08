import React, {useState, useMemo, useCallback} from 'react';

import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {
  Box,
  Breadcrumbs,
  CircularProgress,
  Grid,
  IconButton,
  Link,
} from '@material-ui/core';
import {Form, Formik} from 'formik';

import {
  ConfigFileAggregator,
  GeneralConfigAggregator,
  WhitelabelTypesEnum,
} from 'types/myApps';

import {NavigationButton} from '../shared/Buttons/navigationButton';
import IntlMessages from '@crema/utility/IntlMessages';
import {useWeb3} from 'hooks/useWeb3';
import {useHistory, useLocation} from 'react-router-dom';
import {ValidationSchemas} from './utils/validationSchemas';
import {useSendConfig} from 'modules/MyApps/hooks/useSendConfig';
import {GeneralForm} from './forms/General';
import {ThemeForm} from './forms/Theme';
import {WALLET_ROUTE} from 'shared/constants/routes';
import {useMyAppsConfig} from 'modules/MyApps/hooks/useMyAppsConfig';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      margin: theme.spacing(2),
      padding: theme.spacing(2),
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
  return ['General', 'Theme'];
}

// const defaultTheme = new DefaultTheme();

const initConfig: GeneralConfigAggregator = {
  name: 'Swap',
  logo: 'https://swap.dexkit.com/logos/logo_white.svg',
  logo_dark: 'https://swap.dexkit.com/logos/logo.svg',
  domain: 'https://swap.dexkit.com',
  feeRecipient: '0x5bD68B4d6f90Bcc9F3a9456791c0Db5A43df676d',
  buyTokenPercentage: '0.3',
  brand_color: '#ff7149',
  brand_color_dark: '#2172E5',
  support_bsc: true,

  bsc_as_default: true,
  matic_as_default: false,
  avax_as_default: false,
  fantom_as_default: false,
  fee_waive_for_default_token: false,
  is_dark_mode: false,
  hide_powered_by_dexkit: false,
  default_token_list: 'https://tokens.coingecko.com/uniswap/all.json',
  affiliateAddress: '0x5bD68B4d6f90Bcc9F3a9456791c0Db5A43df676d',
  default_token_address: '0x7866E48C74CbFB8183cd1a929cd9b95a7a5CB4F4',
  default_token_address_bsc: '0x314593fa9a2fa16432913dbccc96104541d32d11',
  default_token_address_matic: '0x4d0def42cf57d6f27cd4983042a55dce1c9f853c',
  default_token_address_avax: '',
  default_token_address_fantom: '',
  default_slippage: 1,
};

function _renderStepContent(step: number, formik: any) {
  switch (step) {
    case 0:
      return <GeneralForm formik={formik} />;
    case 1:
      return <ThemeForm formik={formik} />;
    default:
      return <div>Not Found</div>;
  }
}

export default function WizardAggregator(props: any) {
  const {
    match: {params},
  } = props;
  const {slug} = params;
  const history = useHistory();
  const location = useLocation();
  const search = location.search;

  const format = useMemo(() => {
    let params = new URLSearchParams(search);
    return params.get('format') || '';
  }, [search]);

  const classes = useStyles();

  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const {account} = useWeb3();

  const {configs} = useMyAppsConfig(account);

  const {onSendConfigMutation} = useSendConfig();

  const data = useMemo(() => {
    if (configs && slug) {
      const index = configs.findIndex(
        (c, i) =>
          c.type === WhitelabelTypesEnum.AGGREGATOR &&
          c.slug?.toLowerCase() === slug?.toLowerCase(),
      );

      if (index >= 0) {
        return JSON.parse(configs[index].config) as ConfigFileAggregator;
      }
    }
  }, [configs, slug]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const [textButtonCopy, setTextButtonCopy] = useState(
    'Copy Wordpress Shortcode',
  );

  const handleCopyShortcode = useCallback(
    (values: any) => {
      if (!values) {
        return;
      }

      setTextButtonCopy('Copied');
      let text = '';
      if (values.logo) {
        text = `logo="${values.logo}"`;
      }
      if (values.logo_dark) {
        text = `${text} logo_dark="${values.logo_dark}"`;
      }
      if (values.bsc_as_default) {
        text = `${text} bsc_as_default="true"`;
      }
      if (values.matic_as_default) {
        text = `${text} matic_as_default="true"`;
      }
      if (values.avax_as_default) {
        text = `${text} avax_as_default="true"`;
      }
      if (values.fantom_as_default) {
        text = `${text} fantom_as_default="true"`;
      }
      if (values.is_dark_mode) {
        text = `${text} is_dark_mode="true"`;
      }
      if (values.hide_tabs) {
        text = `${text} hide_tabs="true"`;
      }

      if (values.hide_network_selector) {
        text = `${text} hide_network_selector="true"`;
      }

      if (values.hide_network_dropdown) {
        text = `${text} hide_network_dropdown="true"`;
      }

      if (values.default_token_address) {
        text = `${text} default_token_address_eth="${values.default_token_address}"`;
      }

      if (values.default_token_address_bsc) {
        text = `${text} default_token_address_bsc="${values.default_token_address_bsc}"`;
      }
      if (values.default_token_address_matic) {
        text = `${text} default_token_address_matic="${values.default_token_address_matic}"`;
      }

      if (values.default_token_address_avax) {
        text = `${text} default_token_address_avax="${values.default_token_address_avax}"`;
      }

      if (values.default_token_address_fantom) {
        text = `${text} default_token_address_fantom="${values.default_token_address_fantom}"`;
      }

      if (values.feeRecipient) {
        text = `${text} affiliate="${values.feeRecipient}"`;
      }

      if (values.buyTokenPercentage) {
        text = `${text} buy_token_percentage="${values.buyTokenPercentage}"`;
      }

      if (values.default_token_address_fantom) {
        text = `${text} default_token_address_fantom="${values.default_token_address_fantom}"`;
      }
      if (values.brand_color) {
        text = `${text} brand_color="${values.brand_color}"`;
      }
      if (values.brand_color_dark) {
        text = `${text} brand_color_dark="${values.brand_color_dark}"`;
      }
      if (values.default_slippage) {
        text = `${text} default_slippage="${values.default_slippage}"`;
      }

      if (values.name) {
        text = `${text} name="${values.name}"`;
      }

      if (values.hide_powered_by_dexkit) {
        text = `${text} hide_powered_by_dexkit="true"`;
      }
      let shortCodeToCopy = `[dexkit_aggregator ${text} ]`;
      if (format === 'codecanyon') {
        shortCodeToCopy = `[dexkit_aggregator_codecanyon ${text} ]`;
      }
      navigator.clipboard.writeText(shortCodeToCopy);
      document.execCommand('copy');
      setTimeout(() => {
        setTextButtonCopy('Copy Shortcode');
      }, 500);
    },
    [format],
  );

  const _handleSubmit = (values: any) => {
    onSendConfigMutation.mutate({
      config: values,
      type: WhitelabelTypesEnum.AGGREGATOR,
    });
  };
  const showForm = useMemo(() => {
    if (slug) {
      return !!data;
    } else {
      return true;
    }
  }, [slug, data]);

  const getInitialFormValues = useMemo(() => {
    if (slug) {
      return data || {};
    } else {
      return initConfig;
    }
  }, [slug, data]);

  const handleBackRoute = useCallback(() => {
    if (history.length > 0) {
      history.goBack();
    } else {
      history.push(WALLET_ROUTE);
    }
  }, [history]);

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={12}>
          <Breadcrumbs aria-label='breadcrumb'>
            <Link
              color='inherit'
              onClick={() => history.push('/my-apps/manage')}>
              <IntlMessages id={'myapps.myapps'} defaultMessage={'My Apps'} />
            </Link>
            <Typography color='textPrimary'>
              {' '}
              <IntlMessages id={'myapps.wizard'} defaultMessage={'Wizard'} />
            </Typography>
          </Breadcrumbs>
        </Grid>
        <Grid item xs={12} md={12}>
          <Box display={'flex'} alignItems={'center'}>
            <IconButton size='small' onClick={handleBackRoute}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant='h4' color='textPrimary'>
              <IntlMessages
                id={'myapps.aggregator'}
                defaultMessage={'Aggregator'}
              />
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={12}>
          {showForm && (
            <Formik
              initialValues={getInitialFormValues}
              onSubmit={_handleSubmit}
              validationSchema={ValidationSchemas[activeStep]}>
              {(formik) => (
                <Form id={'aggregator-form'}>
                  <Stepper activeStep={activeStep} orientation='vertical'>
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent>
                          {_renderStepContent(activeStep, formik)}

                          <NavigationButton
                            ButtonBackText='Back'
                            ButtonNextText={
                              activeStep === steps.length - 1
                                ? 'Finish'
                                : 'Next'
                            }
                            handleBack={
                              activeStep === 0 ? undefined : handleBack
                            }
                            handleNext={
                              activeStep >= steps.length || !formik.isValid
                                ? undefined
                                : handleNext
                            }
                            classes={classes}
                          />
                        </StepContent>
                      </Step>
                    ))}
                  </Stepper>
                  {activeStep === steps.length && (
                    <Paper
                      square
                      elevation={0}
                      className={classes.resetContainer}>
                      <Typography>
                        <IntlMessages
                          id={'myapps.allStepsCompleted'}
                          defaultMessage={
                            ' All steps completed - you are finished'
                          }
                        />
                      </Typography>
                      <Button onClick={handleReset} className={classes.button}>
                        <IntlMessages
                          id={'myapps.reset'}
                          defaultMessage={'Reset'}
                        />
                      </Button>
                      <Button
                        disabled={onSendConfigMutation.isLoading}
                        variant='contained'
                        color='primary'
                        type='submit'
                        className={classes.button}>
                        {onSendConfigMutation.isLoading && (
                          <CircularProgress color='inherit' />
                        )}
                        {onSendConfigMutation.isLoading
                          ? 'Waiting Wallet'
                          : 'Submit'}
                      </Button>
                    </Paper>
                  )}
                  <Paper
                    square
                    elevation={0}
                    className={classes.resetContainer}>
                    <Button
                      onClick={() => handleCopyShortcode(formik.values)}
                      className={classes.button}
                      color='primary'>
                      {textButtonCopy}
                    </Button>
                  </Paper>
                </Form>
              )}
            </Formik>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
