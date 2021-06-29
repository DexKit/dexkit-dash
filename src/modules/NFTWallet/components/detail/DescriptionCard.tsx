import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Link,
  IconButton,
} from '@material-ui/core';

import {Link as RouterLink} from 'react-router-dom';

import {Skeleton} from '@material-ui/lab';
import {getWindowUrl} from 'utils/browser';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {
  getAssetOwnerName,
  isAssetOwner,
  isAssetSingleOwner,
} from 'modules/NFTWallet/utils';
import IntlMessages from '@crema/utility/IntlMessages';

interface Props {
  asset: any;
  loading?: boolean;
  error?: any;
}

export default (props: Props) => {
  const {asset, loading, error} = props;
  const userAccountAddress = useDefaultAccount();

  return (
    <Card>
      <CardContent>
        <Link>
          <Typography variant='body1'>
            {loading ? <Skeleton /> : asset?.collection?.name}
          </Typography>
        </Link>

        <Typography
          style={{fontWeight: 700}}
          gutterBottom
          variant='h4'
          component='h1'>
          {loading ? <Skeleton /> : <>{asset?.name}</>}
        </Typography>
        {asset && isAssetSingleOwner(asset) ? (
          <Typography gutterBottom variant='body2'>
            <IntlMessages id='nfts.detail.ownedBy' />{' '}
            {isAssetOwner(asset, userAccountAddress || '') ? (
              <Link>
                <IntlMessages id='nfts.detail.you' />
              </Link>
            ) : (
              <Link>{getAssetOwnerName(asset)}</Link>
            )}
          </Typography>
        ) : null}
        <Typography variant='body1' color='textSecondary'>
          {loading ? <Skeleton /> : asset?.description}
        </Typography>
      </CardContent>
    </Card>
  );
};
