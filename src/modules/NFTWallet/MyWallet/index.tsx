import React, {useCallback, useEffect, useState} from 'react';
import {
  Box,
  Breadcrumbs,
  Grid,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import useOpenSeaPort from 'hooks/useOpenSeaPort';
import {OpenSeaAsset} from 'opensea-js/lib/types';
import AssetCard from '../AssetCard';
import {useHistory} from 'react-router';
import AssetsSkeleton from '../AssetsSkeleton';
import PageTitle from 'shared/components/PageTitle';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@crema/utility/IntlMessages';

const useMyAssets = () => {
  const [loading, setLoading] = useState(false);
  const {openSeaPort} = useOpenSeaPort();
  const [assets, setAssets] = useState<OpenSeaAsset[] | null>([]);
  const address = useDefaultAccount();

  useEffect(() => {
    if (openSeaPort) {
      (async () => {
        setLoading(true);

        let result = await openSeaPort?.api
          .getAssets({owner: address})
          .finally(() => {
            setLoading(false);
          });
        console.log(result);
        setAssets(result?.assets);
      })();
    }
  }, [openSeaPort, address]);

  return {assets, loading};
};

export default () => {
  const {assets, loading} = useMyAssets();
  const history = useHistory();
  const {messages} = useIntl();

  const [sortBy, setSortBy] = useState('');

  const handleAssetClick = useCallback(
    (asset: OpenSeaAsset) => {
      history.push(`/nfts/assets/${asset.tokenAddress}/${asset?.tokenId}`);
    },
    [history],
  );

  const handleChangeSortBy = useCallback((e) => {
    setSortBy(e.target.value);
  }, []);

  return (
    <Box>
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
        title={{name: messages['nfts.walletTitle'].toString()}}
      />
      {assets ? (
        <>
          <Box mb={2}>
            <Grid
              container
              spacing={2}
              justify='flex-end'
              alignContent='center'
              alignItems='center'>
              <Grid item>
                <Typography variant='body1'>
                  {assets?.length || 0} <IntlMessages id='nfts.walletResults' />
                </Typography>
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
                </Select>
              </Grid>
            </Grid>
          </Box>
          <Grid container spacing={2}>
            {assets?.map((asset: OpenSeaAsset) => (
              <Grid key={asset.tokenId} item xs={12} sm={3}>
                <AssetCard
                  key={asset.tokenId}
                  asset={asset}
                  onClick={handleAssetClick}
                />
              </Grid>
            ))}
          </Grid>
        </>
      ) : null}
      {loading ? <AssetsSkeleton count={8} /> : null}
    </Box>
  );
};
