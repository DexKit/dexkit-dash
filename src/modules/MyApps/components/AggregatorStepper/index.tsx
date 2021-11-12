import React, {useState} from 'react';

import {useIntl} from 'react-intl';
import {EIP712TypedData} from '@0x/types';
import {Web3Wrapper} from '@0x/web3-wrapper';
import {eip712Utils} from '@0x/order-utils';
import {MetamaskSubprovider} from '@0x/subproviders';
import {makeStyles, useTheme} from '@material-ui/core';
import IntlMessages from '@crema/utility/IntlMessages';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import GeralStep from './Geral';
import ThemeStep from './Theme';
import LinksStep from './Links';
import {useWeb3} from 'hooks/useWeb3';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router';
import StepperHeader from './StepperHeader';
import {sendConfig} from 'services/my-apps';
import {NotificationType} from 'services/notification';
import {onAddNotification} from 'redux/_notification/actions';
import {Notification as CustomNotification} from 'types/models/Notification';

interface IStep {
  id: string;
  title: string;
  component: (props: any) => React.ReactElement;
}

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

const useStyles = makeStyles((theme) => ({
  btnGroup: {
    display: 'flex',
    flexDirection: 'row',
    margin: theme.spacing(3, 0),
  },
  divider: {
    margin: theme.spacing(0, 1),
    color: '#3A3D4A',
  },
  stepper: {
    height: '100%',
    backgroundColor: '#2F3142',
  },
}));

const AggregatorStepper: React.FC = () => {
  const theme = useTheme();
  const classes = useStyles();
  const {messages} = useIntl();
  const history = useHistory();
  const dispatch = useDispatch();
  const {chainId, account, getProvider} = useWeb3();
  const [isLoading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const [geralData, setGeralData] = useState(initialValues.geral);
  const [themeData, setThemeData] = useState(initialValues.theme);
  const [linksData, setLinksData] = useState(initialValues.links);

  const steps: IStep[] = [
    {
      id: 'geral',
      title: messages['app.myApps.geral'] as string,
      component: (props) => <GeralStep {...props} />,
    },
    {
      id: 'theme',
      title: messages['app.myApps.theme'] as string,
      component: (props) => <ThemeStep {...props} />,
    },
    {
      id: 'links',
      title: messages['app.myApps.links'] as string,
      component: (props) => <LinksStep {...props} />,
    },
  ];

  const handleSubmit = () => {
    //send data
    if (!isLoading) {
      setLoading(true);
      setTimeout(function () {
        try {
          if (account) {
            const ethAccount = account;
            const provider = new MetamaskSubprovider(getProvider() as any);

            const msgParams: EIP712TypedData = {
              types: {
                EIP712Domain: [
                  {name: 'name', type: 'string'},
                  {name: 'version', type: 'string'},
                  {name: 'chainId', type: 'uint256'},
                  {name: 'verifyingContract', type: 'address'},
                ],
                Message: [
                  {name: 'message', type: 'string'},
                  {name: 'terms', type: 'string'},
                ],
              },
              primaryType: 'Message',
              domain: {
                name: 'DexKit',
                version: '1',
                chainId: chainId || 1,
                verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
              },
              message: {
                message: `${messages['app.myApps.iWantToCreateEditThis']} ${messages['app.myApps.aggregator']}`,
                terms: `${messages['app.myApps.poweredByDexKit']}`,
              },
            };

            const web3Metamask = new Web3Wrapper(provider);

            const typedData = eip712Utils.createTypedData(
              msgParams.primaryType,
              msgParams.types,
              msgParams.message,
              // @ts-ignore
              msgParams.domain,
            );

            web3Metamask
              .signTypedDataAsync(ethAccount.toLowerCase(), typedData)
              .then((signature) => {
                const dataToSend = {
                  signature,
                  type: 'AGGREGATOR',
                  config: JSON.stringify({
                    ...geralData,
                    ...themeData,
                    ...linksData,
                  }),
                  message: JSON.stringify(typedData),
                  owner: ethAccount,
                };

                sendConfig(dataToSend)
                  .then((c: any) => {
                    const notification: CustomNotification = {
                      title: `${messages['app.myApps.configAccepted']}`,
                      body: `${messages['app.myApps.configCreated']}`,
                    };
                    dispatch(onAddNotification([notification]));
                    history.push(`/my-apps/manage`);
                  })
                  .catch(() => {
                    const notification: CustomNotification = {
                      title: `${messages['app.myApps.error']}`,
                      body: `${messages['app.myApps.configErrorDoYouHaveHaveKIT']}`,
                    };
                    dispatch(
                      onAddNotification([notification], NotificationType.ERROR),
                    );
                  });
              });
          }
        } catch (error) {
          throw new Error(error.message);
        }

        setLoading(false);
      }, 2000);
    }
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
    switch (step.id) {
      case 'geral':
        return [geralData, setGeralData];
      case 'theme':
        return [themeData, setThemeData];
      case 'links':
        return [linksData, setLinksData];
      default:
        return [];
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card
          component={Paper}
          // @ts-ignore
          style={{backgroundColor: theme.palette.background.darker}}>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            <StepperHeader steps={steps} activeStep={activeStep} />
          </Stepper>
          <Grid container spacing={2}>
            {(() => {
              const [data, setData] = getStepData(activeStep);
              return steps[activeStep].component({data, setData});
            })()}
          </Grid>
          <Divider className={classes.divider} />
          <Grid container>
            <Grid item xs={12}>
              {activeStep === steps.length ? (
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant='body1'>
                      <IntlMessages id='app.myApps.allStepsCompleted' />
                    </Typography>
                    <Box className={classes.btnGroup}>
                      <Box style={{flex: '1 1 auto'}} />
                      <Button onClick={handleReset}>
                        <IntlMessages id='app.myApps.reset' />
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              ) : (
                <Box className={classes.btnGroup}>
                  <Grid container spacing={6}>
                    <Grid item xs={8} />
                    <Grid item xs={4}>
                      <Grid container justifyContent='space-between'>
                        <Grid item xs={6} style={{textAlign: 'right'}}>
                          <Button
                            size='large'
                            variant='contained'
                            color='inherit'
                            disabled={activeStep === 0}
                            onClick={handleBack}>
                            <IntlMessages id='app.myApps.back' />
                          </Button>
                        </Grid>
                        <Grid item xs={6}>
                          <Button
                            size='large'
                            variant='contained'
                            onClick={handleNext}
                            color='primary'>
                            {activeStep === steps.length - 1 ? (
                              <IntlMessages id='app.myApps.submit' />
                            ) : (
                              <IntlMessages id='app.myApps.next' />
                            )}
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AggregatorStepper;
