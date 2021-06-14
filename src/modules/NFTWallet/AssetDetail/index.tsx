import React, {useCallback, useEffect, useState} from 'react';

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  makeStyles,
  Typography,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import {OpenSeaAsset} from 'opensea-js/lib/types';
import useOpenSeaPort from 'hooks/useOpenSeaPort';
import {useHistory, useParams} from 'react-router';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {OpenSeaPort} from 'opensea-js';
import {useWeb3} from 'hooks/useWeb3';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SubjectIcon from '@material-ui/icons/Subject';
import IntlMessages from '@crema/utility/IntlMessages';
import AbbrAddress from 'shared/components/TextUtils/AbbrAddress';

const useStyles = makeStyles((theme) => ({
  assetImage: {
    padding: theme.spacing(50),
  },
}));

export function useAsset() {
  const {getProvider} = useWeb3();
  const [loading, setLoading] = useState(false);
  const [asset, setAsset] = useState<OpenSeaAsset | null>();

  const getAsset = useCallback(
    (tokenAddress: string, tokenId: string) => {
      let openSeaPort = new OpenSeaPort(getProvider());

      setLoading(true);

      openSeaPort?.api
        .getAsset({tokenAddress, tokenId})
        .then((asset) => {
          setAsset(asset);
        })
        .finally(() => setLoading(false));
    },
    [getProvider],
  );

  return {getAsset, asset, loading};
}

interface RouteParams {
  address: string;
  token: string;
}

export const AssetDetail = () => {
  const classes = useStyles();
  const {getAsset, asset, loading} = useAsset();
  const account = useDefaultAccount();

  const {address, token}: RouteParams = useParams();

  useEffect(() => {
    if (account) {
      console.log('entra em account');
      getAsset(address, token);
      console.log(address);
    }
  }, [account, address, token]);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardMedia image={asset?.imageUrl} className={classes.assetImage} />
          </Card>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Card>
            <CardContent>
              <Link>
                <Typography variant='body1'>
                  {asset?.assetContract?.name}
                </Typography>
              </Link>
              <Typography gutterBottom variant='h5' component='h1'>
                {asset?.name}
              </Typography>
              <Typography variant='body1' color='textSecondary'>
                {asset?.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
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
                        href={`https://etherscan.io/address/${asset?.assetContract.address}`}
                        target='_blank'>
                        <AbbrAddress
                          address={asset?.assetContract.address || ''}
                        />
                      </Link>
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
                    <Typography variant='body1'>{asset?.tokenId}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssetDetail;
