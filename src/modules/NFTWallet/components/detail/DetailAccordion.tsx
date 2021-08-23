import IntlMessages from '@crema/utility/IntlMessages';
import {
  Link,
  Typography,
  Box,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';

import React from 'react';
import ButtonCopy from 'shared/components/ButtonCopy';
import {truncateAddress} from 'utils';
import SubjectIcon from '@material-ui/icons/Subject';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Skeleton} from '@material-ui/lab';

interface Props {
  asset?: any;
  loading?: boolean;
  error?: any;
}

export default (props: Props) => {
  const {asset, loading, error} = props;

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
              <Grid container justify='space-between'>
                <Grid item>
                  <Typography variant='body1'>
                    <IntlMessages id='nfts.detail.detailContractAddress' />
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography>
                    <Link
                      href={`https://etherscan.io/address/${asset?.asset_contract?.address}`}
                      target='_blank'>
                      {truncateAddress(asset?.asset_contract?.address)}
                    </Link>
                    <ButtonCopy
                      copyText={asset?.asset_contract?.address}
                      titleText='Copied to Clipboard'
                    />
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container justify='space-between'>
                <Grid item>
                  <Typography variant='body1'>
                    <IntlMessages id='nfts.detail.detailTokenIdLabel' />
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant='body1'>{asset?.token_id}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      ) : null}
    </Box>
  );
};
