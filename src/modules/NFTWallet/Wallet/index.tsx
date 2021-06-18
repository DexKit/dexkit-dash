import React, {useCallback, useEffect, useRef, useState} from 'react';
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
  useScrollTrigger,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Button,
} from '@material-ui/core';

import AssetCard from '../AssetCard';
import {useHistory, useParams} from 'react-router';
import AssetsSkeleton from '../AssetsSkeleton';
import PageTitle from 'shared/components/PageTitle';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import useFetch from 'use-http';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import CollectionListSkeleton from '../CollectionListSkeleton';
import useIsMounted from 'hooks/useIsMounted';
import CollectionsCard from '../CollectionsList';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import FilterListIcon from '@material-ui/icons/FilterList';
import ErrorIcon from '@material-ui/icons/Error';

import _ from 'lodash';
import CollectionsList from '../CollectionsList';
import {truncateTokenAddress} from 'utils';
import SearchIcon from '@material-ui/icons/Search';
import {useIntersect} from 'hooks/useIntersect';
import {FormatListBulletedOutlined} from '@material-ui/icons';
import {getWindowUrl} from 'utils/browser';

interface AssetsQuery {
  owner: string;
  offset: number;
  limit: number;
  sortBy: string;
  collection?: string;
}

const useMyAssets = () => {
  const {get, loading} = useFetch('https://api.opensea.io/api/v1/assets');

  const getAssets = useCallback(
    (query: AssetsQuery) => {
      return get(
        `?owner=${query.owner}&order_by=${
          query.sortBy
        }&order_direction=desc&offset=${query.offset}&limit=${
          query.limit
        }&collection=${query.collection || ''}`,
      );
    },
    [get],
  );

  return {getAssets, loading};
};

function useCollections() {
  const {get, loading} = useFetch(
    'https://api.opensea.io/api/v1/collections?offset=0&limit=300',
  );

  const getCollections = useCallback(
    (owner: string, query: string) => {
      return get(`?offset=0&limit=300&asset_owner=${owner}`);
    },
    [get],
  );

  return {
    getCollections,
    loading,
  };
}

const SORT_BY_SALE_DATE = 'sale_date';
const SORT_BY_SALE_COUNT = 'sale_count';
const SORT_BY_VISITOR_COUNT = 'visitor_count';
const SORT_BY_TOTAL_PRICE = 'total_price';

interface RouteParams {
  address: string;
}

interface ListParams {
  owner: string;
  collection?: string;
  sortBy: string;
  limit: number;
  offset: number;
  query: string;
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

interface AssetFilter {
  query: string;
  collection: string;
  sortBy: string;
}

export default () => {
  const theme = useTheme();
  const userAddress = useDefaultAccount();
  const isUpXs = useMediaQuery(theme.breakpoints.up('sm'));
  const classes = useStyles();
  const history = useHistory();
  const {messages} = useIntl();
  const {address}: RouteParams = useParams();
  const {getAssets} = useMyAssets();
  const {getCollections, loading: collectionLoading} = useCollections();

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
  const [sortBy, setSortBy] = useState('');
  const [query, setQuery] = useState('');
  const [hasOffers, setHasOffers] = useState(false);

  //Collection filters
  const [queryCollection, setQueryCollection] = useState('');

  // Input states
  const [queryInputState, setQueryInputState] = useState('');
  const [collectionInputState, setCollectionInputState] = useState('');

  const fetchData = useCallback(async () => {
    setPage(0);
    setLoadingAssets(true);

    getAssets({
      sortBy,
      offset: 0,
      limit: 20,
      owner: address,
      collection,
    })
      .then((data) => {
        let assets = data.assets;

        if (query) {
          assets = assets.filter(
            (value: any) =>
              value.name.toLowerCase().search(query.toLowerCase()) > -1,
          );
        }

        if (hasOffers) {
          assets = assets.filter((value: any) => value.orders);
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

  const handleAssetClick = useCallback(
    (asset: any) => {
      history.push(
        `/nfts/assets/${asset.asset_contract.address}/${asset?.token_id}`,
      );
    },
    [history],
  );

  const handleChangeSortBy = useCallback((e) => {
    setSortBy(e.target.value);
  }, []);

  const handleToggleFilters = useCallback((e) => {
    setShowFilters(false);
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

  const loader = useRef<HTMLDivElement>(null);

  const {observe, setCallback} = useIntersect();

  const handleObserver = useCallback(async () => {
    if (!hasMore) {
      return;
    }

    if (assets.length < 20) {
      return;
    }

    try {
      setLoadingMoreAssets(true);
      let result = await getAssets({
        sortBy,
        offset: page * 20,
        limit: 20,
        owner: address,
        collection,
      });

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
    if (loader.current) {
      observe(loader.current);
    }
  }, [loader.current]);

  useEffect(() => {
    setCallback(handleObserver);
  }, [handleObserver]);

  useEffect(() => {
    getCollections(address, queryCollection).then((data) => {
      setCollections(
        (data || []).filter(
          (col: any) =>
            col.name.toLowerCase().search(queryCollection.toLocaleLowerCase()) >
            -1,
        ),
      );
    });
  }, [address, queryCollection]);

  useEffect(() => {
    fetchData();
  }, [address, query, sortBy, collection, hasOffers]);

  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted) {
      history.replace(`/nfts/wallet/${userAddress}`);
    }
  }, [userAddress]);

  return (
    <Box pt={{xs: 8}}>
      <PageTitle
        breadcrumbs={{
          history: [
            {
              url: '/',
              name: messages['nfts.walletBreadcrumbDashboard'].toString(),
            },
          ],
          active: {
            name: messages['nfts.walletActiveName'].toString(),
          },
        }}
        title={{
          hasCopy: address,
          name: isWalletOwner(address, userAddress)
            ? `${messages['nfts.walletTitle'].toString()}: ${truncateTokenAddress(address)}`
            : isUpXs
            ? address
            : truncateTokenAddress(address),
        }}
      />
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
                        {showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    ) : null
                  }
                  avatar={<FilterListIcon />}
                  title={messages['nfts.walletFilters'].toString()}
                />
                <Collapse in={isUpXs || showFilters}>
                  <CardContent>
                    <Grid container direction='column' spacing={2}>
                      <Grid item xs>
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
                      <Grid item xs>
                        <Box py={2}>
                          <Grid container spacing={2}>
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
              {assetsError ? (
                <Box py={8}>
                  <Grid
                    container
                    justify='center'
                    alignItems='center'
                    alignContent='center'
                    spacing={4}>
                    <Grid item>
                      <ErrorIcon style={{fontSize: theme.spacing(8)}} />
                    </Grid>
                    <Grid item>
                      <Typography gutterBottom variant='h5'>
                        <IntlMessages id='nfts.walletAssetsListErrorTitle' />
                      </Typography>
                      <Button
                        onClick={handleTryAgainAssets}
                        size='small'
                        variant='contained'
                        color='primary'>
                        <IntlMessages id='nfts.walletAssetsListErrorTryAgain' />
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              ) : null}
              {loadingAssets ? (
                <AssetsSkeleton count={8} />
              ) : (
                <>
                  {assets?.length == 0 ? (
                    <Box py={8}>
                      <Grid container alignContent='center' justify='center'>
                        <Grid item>
                          <Typography variant='h5' component='h3'>
                            No items found
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  ) : (
                    <>
                      {!assetsError ? (
                        <>
                          <Box mb={2}>
                            <Grid
                              alignItems='center'
                              alignContent='center'
                              container
                              justify='space-between'
                              spacing={2}>
                              <Grid item>
                                <Box
                                  pt={{xs: 2}}
                                  textAlign={!isUpXs ? 'center' : null}>
                                  <Typography variant='h5'>
                                    {assets?.length || 0}{' '}
                                    {(assets || []).length > 1 ? (
                                      <IntlMessages id='nfts.walletResults' />
                                    ) : (
                                      <IntlMessages id='nfts.walletResult' />
                                    )}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item>
                                <Select
                                  variant='outlined'
                                  fullWidth
                                  value={sortBy}
                                  displayEmpty
                                  onChange={handleChangeSortBy}>
                                  <MenuItem selected value=''>
                                    <IntlMessages id='nfts.walletSortBy' />
                                  </MenuItem>
                                  <MenuItem selected value={SORT_BY_SALE_DATE}>
                                    <IntlMessages id='nfts.walletSortBySaleDate' />
                                  </MenuItem>
                                  <MenuItem selected value={SORT_BY_SALE_COUNT}>
                                    <IntlMessages id='nfts.walletSortBySaleCount' />
                                  </MenuItem>
                                  <MenuItem
                                    selected
                                    value={SORT_BY_VISITOR_COUNT}>
                                    <IntlMessages id='nfts.walletSortByVisitorCount' />
                                  </MenuItem>
                                  <MenuItem
                                    selected
                                    value={SORT_BY_TOTAL_PRICE}>
                                    <IntlMessages id='nfts.walletSortByTotalPrice' />
                                  </MenuItem>
                                </Select>
                              </Grid>
                            </Grid>
                          </Box>
                          <Grid container spacing={2}>
                            {assets?.map((asset: any, index: number) => (
                              <Grid key={index} item xs={12} sm={3}>
                                <AssetCard
                                  asset={asset}
                                  onClick={handleAssetClick}
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
              {loadingMoreAssets ? <AssetsSkeleton count={20} /> : null}
              {assets.length >= 20 ? <div ref={loader} /> : null}
            </Grid>
          </Grid>
        </Box>
      </>
    </Box>
  );
};
