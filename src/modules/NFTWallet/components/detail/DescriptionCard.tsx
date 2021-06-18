import React from 'react';
import {Card, CardContent, Typography, Link} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';
import ButtonCopy from 'shared/components/ButtonCopy';
import {getWindowUrl} from 'utils/browser';

interface Props {
  asset: any;
  loading: boolean;
}

export default (props: Props) => {
  const {asset, loading} = props;

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
          {loading ? (
            <Skeleton />
          ) : (
            <>
              {asset?.name}
              <ButtonCopy
                copyText={`${getWindowUrl()}/nfts/assets/${
                  asset?.asset_contract?.address
                }/${asset?.token_id}`}
                titleText='Copied to Clipboard'
              />
            </>
          )}
        </Typography>
        <Typography variant='body1' color='textSecondary'>
          {loading ? <Skeleton /> : asset?.description}
        </Typography>
      </CardContent>
    </Card>
  );
};
