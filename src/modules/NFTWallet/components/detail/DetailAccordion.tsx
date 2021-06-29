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

interface Props {
  asset?: any;
  loading?: boolean;
  error?: any;
}

export default (props: Props) => {
  const {asset, loading, error} = props;

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <SubjectIcon />{' '}
        <Typography>
          <IntlMessages id='nfts.detail.detailLabel' />
        </Typography>
      </AccordionSummary>
      <AccordionDetails style={{display: 'block'}}>
        <Box p={2}>
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
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
