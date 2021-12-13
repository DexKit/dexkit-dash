import React, {useCallback, useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router-dom';

import {Box, Breadcrumbs, Grid, IconButton, Link} from '@material-ui/core';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {GridContainer} from '@crema';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

import {
  Collection,
  ConfigFileMarketplace,
  GeneralConfig,
  TokenMetaData,
} from 'types/myApps';
import {ChainId} from 'types/blockchain';

import {useMyAppsConfig} from 'hooks/myApps/useMyAppsConfig';
import {useWeb3} from 'hooks/useWeb3';
import {SubmitComponent} from '../shared/Buttons/submit';
import {NavigationButton} from '../shared/Buttons/navigationButton';
import LoadingView from 'modules/Common/LoadingView';

import {WizardProps} from '../shared';

import GeneralForm from './generalForm';
import ThemeForm from '../shared/Theme/themeForm';
import {DefaultTheme} from '../shared/Theme';
import CollectionsForm from './collection/collectionsForm';
import TokensForm from '../shared/Token/tokensForm';

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
  TOKENS = 'tokens',
}

// export interface WizardProps {
//   form: ConfigFileMarketplace;
//   //method to change form values
//   changeIssuerForm: (key: keyof ConfigFileMarketplace | 'editable', value: any) => void;
//   validator: (isValid: boolean) => void;
//   isValid: boolean;
//   editable?: boolean
// }

function getSteps() {
  return ['General', 'Theme', 'Collections', 'Tokens and Deploy'];
}

const defaultTheme = new DefaultTheme();

function getStepContent(
  step: number,
  label: string,
  wizardProps: WizardProps<ConfigFileMarketplace, keyof ConfigFileMarketplace>,
  chainId: ChainId,
) {
  const {
    config: form,
    changeIssuerForm,
    validator,
    isValid,
    editable,
  } = wizardProps;
  const k = Object.values(WizardData)[step];
  const data = form[k];
  switch (step) {
    case 0: {
      const fields: GeneralConfig = data as GeneralConfig;
      return (
        <GeneralForm
          key={'generalForm'}
          title={label}
          fields={fields}
          changeIssuerForm={changeIssuerForm}
          validator={validator}
          config={form}
          isValid={isValid}
          editable={editable}
        />
      );
    }
    case 1:
      const themeName = form?.theme_name ?? '';
      // const theme = form?.theme;
      const theme = form?.theme ?? defaultTheme;
      return (
        <ThemeForm
          themeName={themeName}
          theme={theme}
          changeIssuerForm={changeIssuerForm}
          editable={editable}
        />
      );
    case 2: {
      const collections: Collection[] = data as Collection[];
      return (
        <CollectionsForm
          key={'collectionsForm'}
          title={label}
          collections={collections ?? []}
          changeIssuerForm={changeIssuerForm}
          validator={validator}
          config={form}
          isValid={isValid}
          editable={editable}
        />
      );
    }
    case 3: {
      const tokens: TokenMetaData[] = data as TokenMetaData[];
      return (
        <TokensForm
          key={'tokensForm'}
          title={label}
          tokens={tokens ?? []}
          changeIssuerForm={changeIssuerForm}
          validator={validator}
          config={form}
          isValid={isValid}
          chainId={chainId}
          editable={editable}
        />
      );
    }
    default:
      return <Typography>{'Unknown step'}</Typography>;
  }
}

type MarketplaceParams = {
  slug: string;
};

type MarketplaceProps = RouteComponentProps<MarketplaceParams>;
// const initSocial = {
//   facebook_url: '',
//   reddit_url: '',
//   twitter_url: '',
//   telegram_url: '',
//   discord_url: '',
//   bitcointalk_url: '',
//   youtube_url: '',
//   medium_url: '',
// } as SocialNetworks;

// const initConfig = {
//   collections: [],
//   tokens: [],

//   general: {
//     domain: undefined,
//     feePercentage: undefined,
//     feeRecipient: undefined,
//     icon: undefined,
//     title: undefined,
//     social: initSocial
//   },
//   theme: undefined
// } as ConfigFileMarketplace;

const initConfig = {
  general: {
    title: 'KitDex',
    icon: 'https://lh3.googleusercontent.com/f4Oh2N2SuMo2dXmh0yLOfiJqQsDBoirgwFU_BSjyDM3zhYGe5wfzuA73zxtC8sl7HvO1x3OenT7ipwiH9AoAU_7qXV4srKhst6AG=s0',
    feeRecipient: '0x1f9eEf1A12b56452b8CAba1cFD03d697f1cc68F7',
    feePercentage: 0.1,
    domain: '',
    social: {
      telegram_url: 'https://t.me/dexkit',
      twitter_url: 'https://twitter.com/DexKit',
      github_url: 'https://github.com/DexKit',
    },
  },
  tokens: [
    {
      decimals: 18,
      symbol: 'dai',
      name: 'Dai',
      icon: 'assets/icons/dai.svg',
      unified_cryptoasset_id: 2308,
      primaryColor: '#DEA349',
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      addresses: {
        '1': '0x6b175474e89094c44da98b954eedeac495271d0f',
        '3': '0xfc8862446cd3e4a2e7167e7d97df738407fead07',
        '4': '0x6f2d6ff85efca691aad23d549771160a12f0a0fc',
        '42': '0xc4375b7de8af5a38a93548eb8453a498222c4ff2',
        '50': '',
      },
      website: 'https://makerdao.com/en/dai/',
      description:
        'Dai is an asset-backed, hard currency for the 21st century.',
      c_id: 'dai',
      displayDecimals: 2,
      isStableCoin: true,
      mainnetAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
    },
    {
      symbol: 'weth',
      name: 'Wrapped Ether',
      primaryColor: '#3333ff',
      icon: 'assets/icons/weth.svg',
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      addresses: {
        '1': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        '3': '0xc778417e063141139fce010982780140aa0cd5ab',
        '4': '0xc778417e063141139fce010982780140aa0cd5ab',
        '42': '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
        '50': '0x0b1ba0af832d7c05fd64161e0db78e85978e8082',
      },
      decimals: 18,
      displayDecimals: 3,
      id: 'ethereum',
      c_id: 'ethereum',
      unified_cryptoasset_id: 2396,
      website: 'https://weth.io',
      description: "wETH is 'wrapped ETH'",
      isStableCoin: false,
      mainnetAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    },
  ],
  pairs: [
    {
      base: 'weth',
      quote: 'dai',
      config: {
        basePrecision: 3,
        pricePrecision: 5,
        minAmount: 0.00001,
        maxAmount: 20,
      },
    },
  ],
  marketFilters: [
    {
      text: 'ETH',
      value: 'weth',
    },
    {
      text: 'DAI',
      value: 'dai',
    },
  ],
  author: {
    address: ['0xD00995A10dB2E58A1A90270485056629134B151B'],
    name: 'DexKit',
    description:
      'DexKit Marketplace, this marketplace showcase, how this whitelabel works. You can deploy and costumize your own coin',
    image:
      'https://dexkit.com/wp-content/themes/dexkit-theme/images/logo1.png ',
  },

  collections: [
    {
      id: '',
      symbol: 'Sand',
      name: 'Sandbox Lands',
      imageUrl:
        'https://lh3.googleusercontent.com/SXH8tW1siikB80rwCRnjm1a5xM_MwTg9Xl9Db6mioIk9HIlDM09pVoSR7GKJgS6ulSUpgW9BDtMk_ePX_NKgO9A=w128',
      description:
        'The Sandbox is a community-driven platform where creators can monetize voxel assets and gaming experiences on the blockchain. The Sandbox metaverse comprises a map made up of 166,464 LANDS. LAND owners can host contests and events, stake SAND to earn and customize assets, monetize assets and experiences, vote in the metaverse governance, play games that you or others create, and more! Trade the collection and keep your eyes peeled for future drops.',
      address: '0x50f5474724e0Ee42D9a4e711ccFB275809Fd6d4a',
      type: 'ERC721',
      slug: '',
    },
    {
      symbol: 'Punks',
      name: 'CryptoPunks',
      imageUrl:
        'https://lh3.googleusercontent.com/QB2kKuQEw04X02V9EoC2BNYZV652LYuewUv9ZdR7KJfI9Jocwmd28jIfsGg0umSCr2bOMV8O9UpLAkoaqfYwvwmC=s100',
      description:
        'The CryptoPunks are the first NFT. A fixed set of 10,000, they were launched in mid-2017 and became one of the inspirations for the ERC-721 standard. They have been featured in places like The New York Times, Christie’s of London, Art|Basel Miami, and The PBS NewsHour.',
      address: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB',
      type: 'ERC721',
      slug: '',
    },
    {
      symbol: 'DexKitCoins',
      name: 'DexKitCoins',
      imageUrl:
        'https://lh3.googleusercontent.com/0nfRXC0_htbElIieu1vC98d-aLIgSN3DLF11QpS3Z0LOAQfjgJkXjrof3kNAgPWS_cLTiOFvhMSO89qh7OMY37fy7gjQ7yjkS-64=w128',
      description:
        'It is difficult to stand out in the NFT space, but DEXKIT makes it easy. DEXKIT has created a platform that empowers artists and collectors to show off their works through powerful decentralized tools. The branded NFT Marketplace features WordPress integration so the app can be deployed on many existing websites. This allows creators to endlessly customize the look and feel of their NFT exchange to match their collectibles. Featuring them on their webpage will eliminate the risk of buying phony assets.',
      address: '0x495f947276749Ce646f68AC8c248420045cb7b5e',
      slug: 'dexkit-coins',
      type: 'ERC721',
    },
    {
      symbol: 'Fram',
      name: 'Framergence',
      imageUrl:
        'https://lh3.googleusercontent.com/hjyrtasog6mj7MjSN13T9JA-uTQp-vzuPAJ5OnPs1WFsLOWeN61RmJuOQJXdT5ydGZT-N8uFYZh9oLuu8Pst9C0jwiZjCd2Qv2tKTA=s100',
      description:
        'The first deflationary NFT project. Framergence is a generative NFT art experiment. Fractals creating emergence.',
      address: '0xbC17cd7f1A58bdA5d6181618090813B3050416b5',
      type: 'ERC721',
      slug: '',
    },
    {
      symbol: 'PMONC',
      name: 'Polkamon',
      imageUrl:
        'https://lh3.googleusercontent.com/5ciPSamybZfmS8m45I1hXlUWKOIfAVLApQswnUaJvKHyHFbvPYEpSCkGqhH0TGn54QZCyKh-kzT2sxXIoe4e0aWcHYagwCO3cc_4=w128',
      description:
        'Polkamon are beautifully animated digital collectibles with varying scarcities. Each Polkamon is backed by a truly unique NFT and can be unpacked with $PMON tokens.',
      address: '0x85F0e02cb992aa1F9F47112F815F519EF1A59E2D',
      type: 'ERC721',
      slug: '',
    },
    {
      symbol: 'Land',
      name: 'Decentraland',
      imageUrl:
        'https://lh3.googleusercontent.com/5KIxEGmnAiL5psnMCSLPlfSxDxfRSk4sTQRSyhPdgnu70nGb2YsuVxTmO2iKEkOZOfq476Bl1hAu6aJIKjs1myY=w128',
      description: 'Land',
      address: '0xF87E31492Faf9A91B02Ee0dEAAd50d51d56D5d4d',
      type: 'ERC721',
      slug: '',
    },
    {
      symbol: 'MUMO',
      name: 'MutantMonsters',
      imageUrl:
        'https://lh3.googleusercontent.com/TkalcnKDmuYdUmOEDCEN48zOiYCaSbkZya655YpkJuID7LrgSrr9FMyw1_MrGULvTa_zbNI4CQLS-jbIh_DD_WJQTQ=s60',
      description:
        '2,249 unique Mutant Monsters. Collect Mutants and earn DUST Tokens to breed more Mutants or other NFTs.',
      address: '0x3910d4afdf276a0dc8af632ccfceccf5ba04a3b7',
      type: 'ERC721',
      slug: '',
    },
    {
      symbol: 'Buddies',
      name: 'Blocktime Buddies',
      imageUrl:
        'https://lh3.googleusercontent.com/5wTLfB-qLpt6kB7imZ6TDRyQdQRqBwUjx_M3HLLk7rD5fKT_X1lJozb7ymUzMnXnsljf1ss88uxgfNJ3ZPEri8s=w128',
      description: 'Original characters as crypto collectibles',
      address: '0x07925fbD9A9Bad7f7ccaD02353d0fe24b99AAbB2',
      type: 'ERC721',
      slug: '',
    },
  ],
  theme: defaultTheme,
  theme_light: defaultTheme.componentsTheme, // this is because the componentsTheme property has the default values of a ligth theme
} as ConfigFileMarketplace;

export default function VerticalLinearStepper(props: MarketplaceProps) {
  const {
    match: {params},
    history,
  } = props;
  const {slug} = params;

  const classes = useStyles();

  const [form, setForm] = useState({} as ConfigFileMarketplace);
  const [isValid, setValid] = useState(false);
  // const [editable, setEditable] = React.useState(Boolean(slug));
  const [editable, setEditable] = React.useState(true);
  const [preview, setPreview] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);

  const {account, chainId} = useWeb3();
  const {configs, loading} = useMyAppsConfig(account);

  const steps = getSteps();

  const updateForm = useCallback(
    (key: keyof ConfigFileMarketplace | 'editable', value: any) => {
      const dataType = Object.values(WizardData).find((e) => e === key);
      if (dataType && key !== 'editable') {
        form[key] = value;
        setForm(form);
      } else if (key === 'editable') {
        setEditable(Boolean(value));
      }
    },
    [form, setForm, setEditable],
  );

  useEffect(() => {
    if (editable && configs) {
      const index = configs.findIndex(
        (c, i) =>
          c.type === 'MARKETPLACE' &&
          c.slug?.toLowerCase() === slug?.toLowerCase() &&
          configs[i]?.config != null,
      );
      if (index >= 0) {
        const config: ConfigFileMarketplace = JSON.parse(configs[index].config);
        setForm(config);
      } else {
        setForm({...initConfig});
      }
    } else if (loading) {
      setForm({...initConfig});
    }
  }, [slug, configs, editable, loading]);

  useEffect(() => {
    if (preview) {
      setEditable(false);
    } else {
      setEditable(true);
    }
  }, [preview]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (preview) setEditable(false);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    if (preview) setEditable(false);
  };

  const handleReset = () => {
    setPreview(true);
    setTimeout(() => setActiveStep(0), 500);
  };

  const validator = useCallback(
    (_isValid: boolean) => {
      setValid(_isValid);
    },
    [setValid],
  );

  return (
    <div className={classes.root}>
      <GridContainer>
        <Grid item xs={12} md={12}>
          <Breadcrumbs aria-label='breadcrumb'>
            <Link
              color='inherit'
              onClick={() => history.push('/my-apps/manage')}>
              My Apps
            </Link>
            <Typography color='textPrimary'>Wizard</Typography>
          </Breadcrumbs>
          <Typography variant='h4' color='textPrimary'>
            MARKETPLACE {slug ? `- Editing ${slug}` : ''}
          </Typography>
        </Grid>
      </GridContainer>

      <Stepper activeStep={activeStep} orientation='vertical'>
        {steps.map((label, i) => (
          <Step key={label}>
            <StepLabel>
              {label}
              {activeStep === i && preview && (
                <IconButton
                  aria-label='edit'
                  color='primary'
                  onClick={() => setEditable(true)}
                  disabled={Boolean(editable)}>
                  <EditOutlinedIcon />
                </IconButton>
              )}
            </StepLabel>
            <StepContent>
              {loading === false && form && Object.keys(form).length > 0 ? (
                getStepContent(
                  activeStep,
                  label,
                  {
                    config: form,
                    changeIssuerForm: updateForm,
                    validator,
                    isValid,
                    editable,
                  },
                  Number(chainId ?? ChainId.Mainnet),
                )
              ) : (
                <Box m='auto' padding='5rem' textAlign='center'>
                  <LoadingView />
                </Box>
              )}
              <NavigationButton
                ButtonBackText='Back'
                ButtonNextText={
                  activeStep === steps.length - 1 ? 'Finish' : 'Next'
                }
                handleBack={activeStep === 0 ? undefined : handleBack}
                handleNext={
                  activeStep >= steps.length || !isValid
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
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} className={classes.button}>
            Review
          </Button>
          <SubmitComponent
            data={form}
            text='Submit'
            valid={isValid}
            type={'MARKETPLACE'}
          />
        </Paper>
      )}
    </div>
  );
}
