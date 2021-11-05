import IntlMessages from '@crema/utility/IntlMessages';
import {
  Typography,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';

import React from 'react';
import {truncateAddress} from 'utils';
import {Skeleton} from '@material-ui/lab';
import CopyButton from 'shared/components/CopyButton';
import FileCopy from '@material-ui/icons/FileCopy';

interface Props {
  asset?: any;
  loading?: boolean;
  error?: any;
}

export default (props: Props) => {
  const {asset, loading} = props;
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box py={4}>
      <Box mb={4}>
        <Typography
          style={{lineHeight: '140%'}}
          variant='body1'
          color='textSecondary'>
          {loading ? <Skeleton /> : asset?.description}
        </Typography>
      </Box>
      {asset ? (
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container justify='space-between' spacing={2}>
                <Grid item xs={isMobile ? 12 : undefined}>
                  <Typography variant='body1'>
                    <IntlMessages id='nfts.detail.detailContractAddress' />
                  </Typography>
                </Grid>
                <Grid item xs={isMobile ? 12 : undefined}>
                  <Typography color='textSecondary' variant='body1'>
                    {/* <Link
                      href={`https://etherscan.io/address/${asset?.asset_contract?.address}`}
                      target='_blank'> */}
                    {truncateAddress(asset?.asset_contract?.address)}
                    {/* </Link> */}
                    <CopyButton
                      copyText={asset?.asset_contract?.address}
                      tooltip='Copied to Clipboard'
                      size='small'>
                      <FileCopy />
                    </CopyButton>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container justify='space-between' spacing={2}>
                <Grid item xs={isMobile ? 12 : undefined}>
                  <Typography variant='body1'>
                    <IntlMessages id='nfts.detail.detailTokenIdLabel' />
                  </Typography>
                </Grid>
                <Grid item xs={isMobile ? 12 : undefined}>
                  <Typography color='textSecondary' variant='body1'>
                    {asset?.token_id}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      ) : null}
    </Box>
  );
};
