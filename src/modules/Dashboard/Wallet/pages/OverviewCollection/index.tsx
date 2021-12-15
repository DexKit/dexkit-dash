import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import {
  Grid,
  Box,
  IconButton,
  Breadcrumbs,
  Typography,
} from '@material-ui/core';

import { RouteComponentProps, useHistory } from 'react-router-dom';

import { EthereumNetwork } from 'shared/constants/AppEnums';

import { ReactComponent as ArrowLeftIcon } from '../../../../../assets/images/icons/arrow-left.svg';
import { useCollectionIds } from 'hooks/balance/useCollectionIds';
import { useNFTMetadataURI } from 'hooks/nfts/useNFTMetadataURI';
import IntlMessages from '../../../../../@crema/utility/IntlMessages';

type Params = {
  address: string;
  networkName: EthereumNetwork;
};

type Props = RouteComponentProps<Params>;

const WalletOverviewCollectionPage: React.FC<Props> = (props) => {
  const {
    match: { params },
  } = props;
  const { address, networkName } = params;
  const { messages } = useIntl();

  const tokenIdsQuery = useCollectionIds(address, networkName);

  const metadataQuery = useNFTMetadataURI(
    address,
    networkName,
    tokenIdsQuery.data,
  );

  const history = useHistory();

  const handleBack = useCallback(() => history.push(`/wallet/`), [history]);

  return (
    <>
      <Box py={4}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Grid
              container
              justify='space-between'
              alignItems='center'
              spacing={2}>
              <Grid item xs={12}>
                <Breadcrumbs aria-label='breadcrumb'>
                  <Typography variant='body2' color='textSecondary'>
                    <IntlMessages id='app.dashboard.wallet' />
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    <IntlMessages id='app.dashboard.overview' />
                  </Typography>
                  <Typography variant='body2' color='textSecondary' />
                </Breadcrumbs>
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={2} alignItems='center'>
                  <Grid item>
                    <IconButton onClick={handleBack} size='small'>
                      <ArrowLeftIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={4}>
              {metadataQuery?.data?.map((d) => (
                <p>{d.image} </p>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default WalletOverviewCollectionPage;
