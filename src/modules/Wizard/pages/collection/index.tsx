import {useWeb3} from 'hooks/useWeb3';
import React, {useEffect, useState, useCallback} from 'react';
import {useParams} from 'react-router';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Breadcrumbs,
  Link,
  Button,
  makeStyles,
  useTheme,
} from '@material-ui/core';
import IntlMessages from '@crema/utility/IntlMessages';
import {Link as RouterLink} from 'react-router-dom';
import {
  useCollectionDetails,
  useCollectionMetadata,
} from 'modules/Wizard/hooks';
import {CollectionItems} from 'modules/Wizard/components/setups/erc721/CollectionItems';
import {Skeleton} from '@material-ui/lab';
import DialogPortal from 'shared/components/Common/DialogPortal';
import {MintItemsDialog} from 'modules/Wizard/components/setups/erc721/dialogs/MintItemsDialog';

const useStyles = makeStyles((theme) => ({
  collectionImage: {
    width: theme.spacing(30),
    height: theme.spacing(30),
    borderRadius: '50%',
  },
}));

interface RouteParams {
  contract: string;
}

const CollectionPage = () => {
  const {contract}: RouteParams = useParams();

  const classes = useStyles();

  const {data, get, error, loading} = useCollectionMetadata();

  useEffect(() => {
    get(contract);
  }, [get, contract]);

  const theme = useTheme();

  const [showMintDialog, setShowMintDialog] = useState(false);

  const handleAddItem = useCallback(() => {
    setShowMintDialog(true);
  }, []);

  const handleClose = useCallback(() => {
    setShowMintDialog(false);
  }, []);

  const handleFinish = useCallback(() => {
    get(contract);
  }, [contract]);

  return (
    <>
      <DialogPortal>
        <MintItemsDialog
          maxWidth='sm'
          fullWidth
          open={showMintDialog}
          contractAddress={contract}
          onClose={handleClose}
          onFinish={handleFinish}
        />
      </DialogPortal>
      <Box py={{xs: 8}}>
        <Box mb={4}>
          <Breadcrumbs>
            <Link color='inherit' component={RouterLink} to='/'>
              <IntlMessages id='nfts.walletBreadcrumbDashboard' />
            </Link>
            <Link color='inherit' component={RouterLink} to='/wizard'>
              Collections
            </Link>
            <Link color='inherit' component={RouterLink} to='/wizard'>
              {loading ? <Skeleton /> : data?.name}
            </Link>
          </Breadcrumbs>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={3}>
            <Card>
              <CardContent>
                <Grid
                  direction='column'
                  spacing={4}
                  justify='center'
                  alignContent='center'>
                  <Grid item xs={12}>
                    <Box mb={4} display='flex' justifyContent='center'>
                      {loading ? (
                        <Skeleton
                          variant='circle'
                          height={theme.spacing(30)}
                          width={theme.spacing(30)}
                        />
                      ) : (
                        <img
                          src={data?.image}
                          className={classes.collectionImage}
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography align='center' variant='h5'>
                      {loading ? <Skeleton /> : data?.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      align='center'
                      variant='body2'
                      color='textSecondary'>
                      {loading ? <Skeleton /> : data?.description}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={9}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Paper>
                  <Box p={4}>
                    <Grid container justify='space-between'>
                      <Grid item></Grid>
                      <Grid item>
                        <Button
                          onClick={handleAddItem}
                          variant='contained'
                          color='primary'>
                          Add item
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <CollectionItems contractAddress={contract} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default CollectionPage;
