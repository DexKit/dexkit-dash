import React, {useState, useEffect, useCallback} from 'react';
import {
  Box,
  IconButton,
  Link,
  Typography,
  Breadcrumbs,
  Grid,
  Paper,
  makeStyles,
  useTheme,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {Link as RouterLink, useParams} from 'react-router-dom';
import IntlMessages from '@crema/utility/IntlMessages';

import {ethers} from 'ethers';
import {useNetworkProvider} from 'hooks/provider/useNetworkProvider';
import {slugToChainId} from 'utils/nft';
import {getTokenMetadata} from 'services/nfts';
import {TokenMetadata} from 'types/nfts';
import {getNormalizedUrl} from 'utils/browser';
import {Skeleton} from '@material-ui/lab';
import {deriveUserFromAddr} from 'modules/NFTWallet/utils';

const useStyles = makeStyles((theme) => ({
  image: {
    display: 'block',
    width: '100%',
    height: 'auto',
    borderRadius: theme.shape.borderRadius,
    padding: 0,
    margin: 0,
  },
}));

const abi = [
  {
    inputs: [],
    name: 'baseURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

interface PageParams {
  address: string;
  token: string;
  network: string;
}

export const AssetDetailsPage = () => {
  const handleGoBack = useCallback(() => {}, []);
  const params = useParams<PageParams>();
  const [loading, setLoading] = useState(false);
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata>();
  const [owner, setOwner] = useState<string>();

  const classes = useStyles();
  const theme = useTheme();

  const provider = useNetworkProvider(undefined, slugToChainId(params.network));

  useEffect(() => {
    if (provider) {
      (async () => {
        setLoading(true);
        let contract = new ethers.Contract(params.address, abi, provider);

        let uri = await contract.tokenURI(params.token);

        let metadata = await getTokenMetadata(uri);

        setTokenMetadata(metadata);

        let tokenOwner = await contract.ownerOf(params.token);

        setOwner(tokenOwner);

        setLoading(false);
      })();
    }
  }, [provider, params]);

  return (
    <Box>
      <Box mb={2}>
        <Breadcrumbs>
          <Link color='inherit' component={RouterLink} to='/'>
            <IntlMessages id='nfts.walletBreadcrumbDashboard' />
          </Link>
          <Link color='inherit' component={RouterLink} to='/wizard'></Link>
          <Link color='inherit'></Link>
        </Breadcrumbs>
      </Box>
      <Box mb={2} display='flex' alignItems='center' alignContent='center'>
        <Box mr={2} display='flex' alignItems='center' alignContent='center'>
          <IconButton onClick={handleGoBack} size='small'>
            <ArrowBackIcon />
          </IconButton>
        </Box>
        <Box>
          <Typography variant='h5'>
            {loading ? (
              <Skeleton width={theme.spacing(24)} />
            ) : (
              tokenMetadata?.name
            )}
          </Typography>
        </Box>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={3}>
          <Paper>
            {loading ? (
              <Skeleton variant='rect' className={classes.image} />
            ) : tokenMetadata?.image ? (
              <img
                alt=''
                src={getNormalizedUrl(tokenMetadata?.image)}
                className={classes.image}
              />
            ) : null}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant='h5' component='h1'>
                {loading ? <Skeleton /> : tokenMetadata?.name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Link>{loading ? <Skeleton /> : deriveUserFromAddr(owner)}</Link>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' color='textSecondary'>
                {loading ? <Skeleton /> : tokenMetadata?.description}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssetDetailsPage;
