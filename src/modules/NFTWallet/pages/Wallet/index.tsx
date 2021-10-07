import React, {useCallback, useEffect, useState} from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
  Collapse,
  IconButton,
  InputAdornment,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Button,
  Paper,
  Container,
  Breadcrumbs,
  Link,
} from '@material-ui/core';

import AssetCard from '../../components/detail/AssetCard';
import {useHistory, useLocation, useParams} from 'react-router';
import AssetsSkeleton from '../../components/wallet/AssetsSkeleton';
import PageTitle from 'shared/components/PageTitle';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../../@crema/utility/IntlMessages';

import {useDefaultAccount} from 'hooks/useDefaultAccount';
import CollectionListSkeleton from '../../components/wallet/CollectionListSkeleton';
import useIsMounted from 'hooks/useIsMounted';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import FilterListIcon from '@material-ui/icons/FilterList';
import ErrorIcon from '@material-ui/icons/Error';

import _ from 'lodash';
import CollectionsList from '../../components/wallet/CollectionsList';
import FloatActionBar from '../../components/wallet/FloatActionBar';
import {truncateTokenAddress} from 'utils';
import SearchIcon from '@material-ui/icons/Search';
import {getWindowUrl} from 'utils/browser';
import {useWeb3} from 'hooks/useWeb3';
import {getChainId, RINKEBY_NETWORK} from 'utils/opensea';
import axios from 'axios';
import {useMyAssets} from 'modules/NFTWallet/hooks/wallet';
import ActionSelect, {
  Actions,
} from 'modules/NFTWallet/components/wallet/ActionSelect';

import {Link as RouterLink} from 'react-router-dom';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import {ReactComponent as EmptyWalletImage} from 'assets/images/state/wallet-01.svg';
import {ReactComponent as ConnectivityImage} from 'assets/images/state/connectivity-01.svg';
import CopyButton from 'shared/components/CopyButton';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {NFTEmptyStateImage} from 'shared/components/Icons';

function useCollections() {
  const {getProvider} = useWeb3();

  const getCollections = useCallback(
    async (owner: string, query: string) => {
      const provider = getProvider();
      const chainId = await getChainId(provider);

      const url = `https://${
        chainId == RINKEBY_NETWORK ? 'rinkeby-api' : 'api'
      }.opensea.io/api/v1/collections?offset=0&limit=300?offset=0&limit=300&asset_owner=${owner}`;

      return axios.get(url, {
        headers: {'X-API-KEY': process.env.REACT_APP_OPENSEA_API_KEY},
      });
    },
    [getProvider],
  );

  return {
    getCollections,
  };
}

const SORT_BY_SALE_DATE = 'sale_date';
const SORT_BY_SALE_COUNT = 'sale_count';
const SORT_BY_TOTAL_PRICE = 'sale_price';

interface RouteParams {
  address: string;
}

const isWalletOwner = (address: string, other?: string) => address == other;

const useStyles = makeStyles((theme) => ({
  collectionsTitle: {
    fontWeight: 700,
  },
  list: {
    width: '100%',
    position: 'relative',
    overflowY: 'auto',
    overflowX: 'hidden',
    maxHeight: theme.spacing(60),
  },
}));

export default () => {
  const theme = useTheme();
  const userAddress = useDefaultAccount();
  const isUpXs = useMediaQuery(theme.breakpoints.up('sm'));
  const classes = useStyles();
  const history = useHistory();
  const {messages} = useIntl();
  const {address}: RouteParams = useParams();
  const {getAssets} = useMyAssets();
  const {getCollections} = useCollections();

  const {chainId} = useWeb3();

  const [collectionLoading, setCollectionLoading] = useState(false);

  // misc
  const [showFilters, setShowFilters] = useState(false);
  const [loadingMoreAssets, setLoadingMoreAssets] = useState(false);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // errors
  const [assetsError, setAssetsError] = useState(false);

  // data
  const [assets, setAssets] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);

  // Asset filters
  const [page, setPage] = useState(1);

  const [collection, setCollection] = useState('');
  const [sortBy, setSortBy] = useState('pk');
  const [query, setQuery] = useState('');
  const [hasOffers, setHasOffers] = useState(false);

  //Collection filters
  const [queryCollection, setQueryCollection] = useState('');

  // actions
  const [selectActive, setSelectActive] = useState(false);
  const [action, setAction] = useState('');
  const [showSelectedAssets, setShowSelectedAssets] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<
    Array<{
      name: string;
      tokenId: string;
      tokenAddress: string;
      imageUrl: string;
      schemaName: string;
    }>
  >([]);

  // Input states
  const [queryInputState, setQueryInputState] = useState('');
  const [collectionInputState, setCollectionInputState] = useState('');

  const fetchData = useCallback(async () => {
    setPage(1);
    setLoadingAssets(true);

    getAssets({
      sortBy,
      offset: 0,
      limit: 20,
      owner: address,
      collection,
    })
      .then((response: any) => {
        let assets = response.data.assets;

        if (query) {
          assets = assets.filter(
            (value: any) =>
              value.name.toLowerCase().search(query.toLowerCase()) > -1,
          );
        }

        if (hasOffers) {
          assets = assets.filter((value: any) => value.orders);
        }

        if (assets?.length == 20) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }

        setAssets(assets);
      })
      .catch(() => {
        setAssetsError(true);
      })
      .finally(() => setLoadingAssets(false));
  }, [address, collection, sortBy, query, hasOffers]);

  const setLazyQuery = useCallback(
    _.debounce((value: string) => {
      setQuery(value);
    }, 400),
    [],
  );

  const setLazyQueryCollection = useCallback(
    _.debounce((value: string) => {
      setQueryCollection(value);
    }, 400),
    [],
  );

  const handleQueryInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLazyQuery(e.target.value);
      setQueryInputState(e.target.value);
    },
    [setLazyQuery],
  );

  const handleCollectionQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLazyQueryCollection(e.target.value);
      setCollectionInputState(e.target.value);
    },
    [setLazyQueryCollection],
  );

  const getAssetIndex = useCallback(
    (asset: any) => {
      return selectedAssets.findIndex(
        (value) =>
          value.tokenId?.toLowerCase() === asset?.token_id?.toLowerCase() &&
          value.tokenAddress?.toLowerCase() ===
            asset?.asset_contract?.address?.toLowerCase(),
      );
    },
    [selectedAssets],
  );

  const isAssetSelected = useCallback(
    (asset: any) => {
      return getAssetIndex(asset) > -1;
    },
    [getAssetIndex, selectedAssets],
  );

  const handleAssetClick = useCallback(
    (asset: any) => {
      if (selectActive) {
        const assetIndex = getAssetIndex(asset);

        if (assetIndex > -1) {
          setSelectedAssets((value) => {
            const newArr = [...value];

            newArr.splice(assetIndex, 1);

            return newArr;
          });
        } else {
          setSelectedAssets((value) => [
            ...value,
            {
              tokenId: asset?.token_id,
              tokenAddress: asset?.asset_contract?.address,
              imageUrl: asset?.image_url,
              schemaName: asset?.asset_contract?.schema_name,
              name: asset?.name,
              collectionName: asset?.collection?.name,
            },
          ]);
        }
      } else {
        history.push(
          `/nfts/assets/${asset.asset_contract.address}/${asset?.token_id}`,
        );
      }
    },
    [isAssetSelected, selectActive, history],
  );

  const handleChangeAction = useCallback((e) => {
    const value = e.target.value;

    setAction(value);

    if (value == '') {
      setSelectActive(false);
      setSelectedAssets([]);
    } else if (value == Actions.CREATE_BUNDLE) {
      setSelectActive(true);
    }
  }, []);

  const handleChangeSortBy = useCallback((e) => {
    setSortBy(e.target.value);
  }, []);

  const handleToggleFilters = useCallback((e) => {
    setShowFilters((value) => !value);
  }, []);

  const handleSelectCollection = useCallback(
    async (slug: string) => {
      if (!isUpXs) {
        setShowFilters(false);
      }

      if (slug == collection) {
        setCollection('');
      } else {
        setCollection(slug);
      }
    },
    [collection, isUpXs],
  );

  const handleToggleHasOffers = useCallback(() => {
    if (!isUpXs) {
      setShowFilters((value) => !value);
    }
    setHasOffers((value) => !value);
  }, [isUpXs]);

  const handleToggleSelectedAssets = useCallback(() => {
    setShowSelectedAssets((value) => !value);
  }, []);

  const handleGoCreateBundle = useCallback(() => {
    history.push({
      pathname: '/nfts/create-bundle',
      state: {
        assets: selectedAssets,
      },
    });
  }, [selectedAssets]);

  const handleCancelCreateBundle = useCallback(() => {
    setAction('');
    setSelectedAssets([]);
    setSelectActive(false);
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore) {
      return;
    }

    if (assets.length < 20) {
      return;
    }

    try {
      setLoadingMoreAssets(true);
      const result = await getAssets({
        sortBy,
        offset: page * 20,
        limit: 20,
        owner: address,
        collection,
      }).then((response: any) => response.data);

      let tempAssets = result.assets;

      if (query) {
        tempAssets = tempAssets.filter(
          (value: any) =>
            value.name.toLowerCase().search(query.toLowerCase()) > -1,
        );
      }

      if (hasOffers) {
        tempAssets = tempAssets.filter((value: any) => value.orders);
      }

      setAssets((value: any) => [...value, ...tempAssets]);
      setPage((value) => value + 1);

      if (result.assets.length < 20) {
        setHasMore(false);
      }

      setLoadingMoreAssets(false);
    } catch (e) {
      setAssets([]);
      setAssetsError(true);
    }
  }, [query, hasOffers, assets, sortBy, address, collection, page]);

  const handleTryAgainAssets = useCallback(() => {
    setAssetsError(false);
    fetchData();
  }, []);

  useEffect(() => {
    setCollectionLoading(true);
    getCollections(address, queryCollection)
      .then((response) => response.data)
      .then((data) => {
        setCollections(
          (data || []).filter(
            (col: any) =>
              col.name
                .toLowerCase()
                .search(queryCollection.toLocaleLowerCase()) > -1,
          ),
        );
      })
      .finally(() => setCollectionLoading(false));
  }, [address, queryCollection]);

  useEffect(() => {
    fetchData();
  }, [address, query, sortBy, collection, hasOffers, chainId]);

  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted) {
      history.replace(`/nfts/wallet/${userAddress}`);
    }
  }, [userAddress]);

  const handleGoBack = useCallback(() => {
    history.push('/wallet');
  }, []);

  const {state} = useLocation<{action: string; asset: any}>();

  useEffect(() => {
    if (state) {
      if (state.action == 'create-bundle') {
        setAction(Actions.CREATE_BUNDLE);
        setSelectActive(true);
        setSelectedAssets([state.asset]);
        history.replace({state: {}});
      }
    }
  }, [state]);

  return (
    <>
      <Box pt={{xs: 8}}>
        <Box mb={2}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Breadcrumbs>
                <Link to='/' color='textPrimary' component={RouterLink}>
                  {messages['nfts.walletBreadcrumbDashboard'].toString()}
                </Link>
                <Link color='textSecondary'>
                  {messages['nfts.walletActiveName'].toString()}
                </Link>
              </Breadcrumbs>
            </Grid>
            <Grid item xs={12}>
              <Box display='flex' alignItems='center' alignContent='center'>
                <Box mr={2}>
                  <IconButton size='small' onClick={handleGoBack}>
                    <ArrowBackIcon />
                  </IconButton>
                </Box>
                <Box mr={2}>
                  <Typography variant='h5'>
                    {isWalletOwner(address, userAddress)
                      ? messages['nfts.walletTitle'].toString()
                      : isUpXs
                      ? address
                      : truncateTokenAddress(address)}
                  </Typography>
                </Box>
                <CopyButton
                  size='small'
                  copyText={`${getWindowUrl()}/nfts/wallet/${address}`}
                  tooltip='Copied!'>
                  <FileCopyIcon />
                </CopyButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <>
          <Box>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={3}>
                <Card>
                  <CardContent>
                    <TextField
                      value={queryInputState}
                      onChange={handleQueryInputChange}
                      fullWidth
                      variant='outlined'
                      placeholder={messages[
                        'nfts.walletSearchPlaceholder'
                      ].toString()}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </CardContent>
                  <CardHeader
                    action={
                      !isUpXs ? (
                        <IconButton onClick={handleToggleFilters}>
                          {showFilters ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      ) : null
                    }
                    avatar={<FilterListIcon />}
                    title={messages['nfts.walletFilters'].toString()}
                  />
                  <Collapse in={isUpXs || showFilters}>
                    <CardContent>
                      <Grid container direction='column' spacing={2}>
                        <Grid item xs={12}>
                          <FormControlLabel
                            color='primary'
                            control={<Checkbox />}
                            checked={hasOffers}
                            onChange={handleToggleHasOffers}
                            label={messages[
                              'nfts.walletHasOffersCheck'
                            ].toString()}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          {collection.length > 0 ? (
                            <>
                              <Box py={2}>
                                <Grid
                                  container
                                  spacing={2}
                                  alignItems='center'
                                  alignContent='center'>
                                  <Grid item>
                                    <ViewComfyIcon />
                                  </Grid>
                                  <Grid item xs>
                                    <Typography
                                      className={classes.collectionsTitle}
                                      variant='body1'>
                                      <IntlMessages id='nfts.walletCollections' />
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Box>
                              <TextField
                                placeholder={messages[
                                  'nfts.walletCollectionFilter'
                                ].toString()}
                                variant='outlined'
                                type='search'
                                onChange={handleCollectionQueryChange}
                                value={collectionInputState}
                                fullWidth
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position='start'>
                                      <SearchIcon />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </>
                          ) : null}
                        </Grid>
                        <Grid item xs>
                          {collectionLoading ? (
                            <CollectionListSkeleton count={5} />
                          ) : null}
                          {collections.length > 0 ? (
                            <Box className={classes.list}>
                              <CollectionsList
                                onSelect={handleSelectCollection}
                                collection={collection}
                                collections={collections}
                              />
                            </Box>
                          ) : null}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Collapse>
                </Card>
              </Grid>
              <Grid item xs={12} sm={9}>
                <Box mb={2}>
                  <Grid
                    alignItems='center'
                    alignContent='center'
                    container
                    justify='space-between'
                    spacing={2}>
                    <Grid item>
                      {assets?.length > 0 ? (
                        <Box pt={{xs: 2}} textAlign={!isUpXs ? 'center' : null}>
                          <Typography variant='h5'>
                            {assets?.length || 0}{' '}
                            {(assets || []).length > 1 ? (
                              <IntlMessages id='nfts.walletResults' />
                            ) : (
                              <IntlMessages id='nfts.walletResult' />
                            )}
                          </Typography>
                        </Box>
                      ) : null}
                    </Grid>
                    <Grid item>
                      <Grid container spacing={2}>
                        {/* <Grid item>
                          <ActionSelect
                            value={action}
                            onChange={handleChangeAction}
                            fullWidth
                            variant='outlined'
                          />
                        </Grid> */}
                        <Grid item>
                          <Select
                            variant='outlined'
                            fullWidth
                            value={sortBy}
                            displayEmpty
                            onChange={handleChangeSortBy}>
                            <MenuItem selected value='pk'>
                              <IntlMessages id='nfts.walletSortBy' />
                            </MenuItem>
                            <MenuItem selected value={SORT_BY_SALE_DATE}>
                              <IntlMessages id='nfts.walletSortBySaleDate' />
                            </MenuItem>
                            <MenuItem selected value={SORT_BY_SALE_COUNT}>
                              <IntlMessages id='nfts.walletSortBySaleCount' />
                            </MenuItem>
                            <MenuItem selected value={SORT_BY_TOTAL_PRICE}>
                              <IntlMessages id='nfts.walletSortByTotalPrice' />
                            </MenuItem>
                          </Select>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
                {assetsError ? (
                  <Box py={8}>
                    <Grid
                      container
                      justify='center'
                      alignItems='center'
                      alignContent='center'
                      spacing={4}>
                      <Grid item>
                        <ConnectivityImage />
                      </Grid>
                      <Grid item>
                        <Grid
                          direction='column'
                          container
                          alignItems='center'
                          alignContent='center'
                          spacing={2}>
                          <Grid item xs={12}>
                            <Typography gutterBottom variant='h5'>
                              <IntlMessages id='nfts.walletAssetsListErrorTitle' />
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Button
                              onClick={handleTryAgainAssets}
                              size='small'
                              color='primary'>
                              <IntlMessages id='nfts.walletAssetsListErrorTryAgain' />
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                ) : null}
                {loadingAssets ? (
                  <AssetsSkeleton count={8} />
                ) : (
                  <>
                    {assets?.length == 0 && !assetsError ? (
                      <Box py={8}>
                        <Grid
                          container
                          direction='column'
                          alignContent='center'
                          justify='center'
                          alignItems='center'
                          spacing={4}>
                          <Grid item xs={12}>
                            <NFTEmptyStateImage />
                          </Grid>
                          <Grid item xs={12}>
                            <Typography align='center' variant='h5'>
                              <IntlMessages id='nfts.wallet.noItemsFound' />
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    ) : (
                      <>
                        {!assetsError ? (
                          <>
                            <Grid container spacing={2}>
                              {assets?.map((asset: any, index: number) => (
                                <Grid key={index} item xs={12} sm={3}>
                                  <AssetCard
                                    forSelect={selectActive}
                                    asset={asset}
                                    onClick={handleAssetClick}
                                    selected={isAssetSelected(asset)}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </>
                        ) : null}
                      </>
                    )}
                  </>
                )}
                {hasMore ? (
                  <Box py={4}>
                    <Button
                      color='primary'
                      size='large'
                      onClick={handleLoadMore}
                      disabled={loadingMoreAssets}
                      startIcon={
                        loadingMoreAssets ? (
                          <CircularProgress
                            size={theme.spacing(6)}
                            color='inherit'
                          />
                        ) : null
                      }
                      variant='outlined'
                      fullWidth>
                      <IntlMessages id='nfts.wallet.loadMore' />
                    </Button>
                  </Box>
                ) : null}
              </Grid>
            </Grid>
          </Box>
        </>
      </Box>
      {action == Actions.CREATE_BUNDLE ? (
        <FloatActionBar>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Collapse in={showSelectedAssets}>1</Collapse>
            </Grid>
            <Grid item xs={12}>
              <Grid
                alignItems='center'
                alignContent='center'
                container
                justify='space-between'
                spacing={2}>
                <Grid item>
                  <IconButton onClick={handleToggleSelectedAssets}>
                    {showSelectedAssets ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                </Grid>
                <Grid item>
                  <Grid
                    container
                    alignItems='center'
                    alignContent='center'
                    spacing={2}>
                    <Grid item>
                      <Button
                        onClick={handleGoCreateBundle}
                        disabled={selectedAssets.length == 0}
                        size='large'
                        color='primary'
                        variant='contained'>
                        <IntlMessages id='nfts.wallet.sell' />
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        onClick={handleCancelCreateBundle}
                        size='large'
                        variant='outlined'>
                        <IntlMessages id='nfts.wallet.cancel' />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </FloatActionBar>
      ) : null}
    </>
  );
};
