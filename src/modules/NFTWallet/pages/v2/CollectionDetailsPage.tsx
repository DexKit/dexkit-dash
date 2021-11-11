import React, {useState, useEffect, useCallback} from 'react';
import {
  Box,
  IconButton,
  Link,
  Typography,
  Breadcrumbs,
  Card,
  CardContent,
  CardMedia,
  Grid,
  makeStyles,
  useTheme,
  TextField,
  InputAdornment,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SearchIcon from '@material-ui/icons/Search';

import {Link as RouterLink, useParams} from 'react-router-dom';
import {ethers} from 'ethers';
import {useNetworkProvider} from 'hooks/provider/useNetworkProvider';
import {slugToChainId} from 'utils/nft';
import {getTokenMetadata} from 'services/nfts';
import {NftToken} from 'types/nfts';
import {getNormalizedUrl} from 'utils/browser';
import {Skeleton} from '@material-ui/lab';
import {deriveUserFromAddr} from 'modules/NFTWallet/utils';

const useStyles = makeStyles((theme) => ({
  image: {
    display: 'block',
    width: '100%',
    height: 'auto',
    minHeight: theme.spacing(40),
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
  {
    inputs: [],
    name: 'symbol',
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
    inputs: [],
    name: 'name',
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
];

interface PageParams {
  address: string;
  network: string;
}

export const CollectionDetailsPage = () => {
  const handleGoBack = useCallback(() => {}, []);
  const params = useParams<PageParams>();
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<{name: string; symbol: string}>();
  const [tokens, setTokens] = useState<NftToken[]>();

  const classes = useStyles();
  const theme = useTheme();

  const provider = useNetworkProvider(undefined, slugToChainId(params.network));

  useEffect(() => {
    if (provider) {
      console.log(provider);
      (async () => {
        setLoading(true);
        let contract = new ethers.Contract(params.address, abi, provider);

        let name = await contract.name();
        let symbol = await contract.symbol();

        setMetadata({
          name,
          symbol,
        });

        let filters = contract.filters.Transfer(
          ethers.constants.AddressZero,
          null,
        );

        let latestBlock = await provider.getBlockNumber();
        let currBlockNumber = latestBlock;

        let tokenIds = new Set<string>();

        while (tokenIds.size <= 10) {
          let events = await contract.queryFilter(
            filters,
            currBlockNumber - 1500,
            currBlockNumber,
          );

          let newTokens = events.map((e) => {
            return e.topics[3];
          });

          tokenIds = new Set([...tokenIds, ...newTokens]);

          currBlockNumber = currBlockNumber - 1500;
        }

        let collectionTokens: NftToken[] = [];

        for (let tokenId of tokenIds) {
          let tokenURI = await contract.tokenURI(tokenId);

          let tokenMetadata = await getTokenMetadata(tokenURI);

          let owner = await contract.ownerOf(tokenId);

          collectionTokens.push({
            tokenId: parseInt(tokenId),
            metadata: tokenMetadata,
            owners: [owner],
          });
        }

        setTokens(collectionTokens);

        setLoading(false);
      })();
    }
  }, [provider, params]);

  return (
    <Box>
      <Box mb={2}>
        <Breadcrumbs>
          <Link color='inherit' component={RouterLink} to='/'>
            Home
          </Link>
          <Link color='inherit' component={RouterLink} to='/'>
            Collections
          </Link>
        </Breadcrumbs>
      </Box>
      <Box mb={4} display='flex' alignItems='center' alignContent='center'>
        <Box mr={2} display='flex' alignItems='center' alignContent='center'>
          <IconButton onClick={handleGoBack} size='small'>
            <ArrowBackIcon />
          </IconButton>
        </Box>
        <Box>
          <Typography variant='h5'>
            {loading ? (
              <Skeleton width={theme.spacing(12)} />
            ) : (
              <>
                {metadata?.name} ({metadata?.symbol})
              </>
            )}
          </Typography>
        </Box>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <TextField
                placeholder='Search'
                variant='outlined'
                type='search'
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={9}>
          <Grid container spacing={4}>
            {tokens?.map((token, index) => (
              <Grid key={index} item xs={12} sm={3}>
                <Card>
                  {token.metadata?.image ? (
                    <CardMedia
                      component={RouterLink}
                      to={`/nfts/collections/${params.network}/${params.address}/${token.tokenId}`}
                      image={getNormalizedUrl(token.metadata?.image)}
                      className={classes.image}
                    />
                  ) : null}
                  <CardContent>
                    <Box>
                      <Typography variant='body1'>
                        {token.owners?.length === 1 ? (
                          <Link>{deriveUserFromAddr(token.owners[0])}</Link>
                        ) : null}
                      </Typography>
                    </Box>
                    <Typography variant='body1'>
                      <Link
                        color='inherit'
                        component={RouterLink}
                        to={`/nfts/collections/${params.network}/${params.address}/${token.tokenId}`}>
                        {token.metadata?.name}
                      </Link>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CollectionDetailsPage;
