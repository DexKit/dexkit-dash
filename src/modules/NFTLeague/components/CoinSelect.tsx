import IntlMessages from '@crema/utility/IntlMessages';
import {
  Button,
  Grid,
  Paper,
  Typography,
  Box,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import {Skeleton} from '@material-ui/lab';
import {useChampionMetadataQuery} from 'modules/CoinLeagues/hooks/champions';
import React from 'react';
import {getNormalizedUrl} from 'utils/browser';

import {useModuleStyle} from '../styles/index';

const useStyle = makeStyles((theme) => ({
  coinSelectImage: {
    height: 'auto',
    width: theme.spacing(20),
  },
  errorPaper: {
    borderColor: theme.palette.error.main,
    borderWidth: 1,
    borderStyle: 'solid',
  },
}));

interface Props {
  tokenId?: string;
  hasError?: boolean;
  onClick?: () => void;
  onClear?: () => void;
  variant?: 'elevation' | 'outlined';
}

const CoinSelect: React.FC<Props> = ({
  hasError,
  tokenId,
  onClick,
  onClear,
  variant = 'elevation',
}) => {
  const classes = useStyle();

  const moduleClasses = useModuleStyle();

  const metadataQuery = useChampionMetadataQuery(tokenId);

  if (tokenId) {
    return (
      <Paper variant={variant}>
        <Box p={4}>
          <Grid container alignItems='center' alignContent='center' spacing={4}>
            <Grid item>
              <Box display='flex' alignItems='center' alignContent='center'>
                {metadataQuery?.isLoading || !metadataQuery?.data?.image ? (
                  <Skeleton
                    variant='rect'
                    className={classes.coinSelectImage}
                  />
                ) : (
                  <img
                    src={getNormalizedUrl(metadataQuery?.data?.image)}
                    alt={metadataQuery?.data?.name}
                    className={classes.coinSelectImage}
                  />
                )}
              </Box>
            </Grid>
            <Grid item xs>
              <Grid
                container
                alignItems='center'
                alignContent='center'
                spacing={2}>
                <Grid item xs={12}>
                  <Typography
                    className={moduleClasses.boldText}
                    color='textPrimary'
                    variant='subtitle1'>
                    {metadataQuery.isLoading ? (
                      <Skeleton />
                    ) : (
                      metadataQuery.data?.name
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={4}>
                    <Grid item>
                      <Typography color='textSecondary' variant='body2'>
                        ATK
                      </Typography>
                      <Typography
                        className={moduleClasses.boldText}
                        color='textPrimary'
                        variant='subtitle1'>
                        {metadataQuery.isLoading ? (
                          <Skeleton />
                        ) : (
                          metadataQuery.data?.attributes.find(
                            (a) => a.trait_type === 'Attack',
                          )?.value
                        )}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography color='textSecondary' variant='body2'>
                        DEF
                      </Typography>
                      <Typography
                        className={moduleClasses.boldText}
                        color='textPrimary'
                        variant='subtitle1'>
                        {metadataQuery.isLoading ? (
                          <Skeleton />
                        ) : (
                          metadataQuery.data?.attributes.find(
                            (a) => a.trait_type === 'Defense',
                          )?.value
                        )}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography color='textSecondary' variant='body2'>
                        RUN
                      </Typography>
                      <Typography
                        className={moduleClasses.boldText}
                        color='textPrimary'
                        variant='subtitle1'>
                        {metadataQuery.isLoading ? (
                          <Skeleton />
                        ) : (
                          metadataQuery.data?.attributes.find(
                            (a) => a.trait_type === 'Run',
                          )?.value
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <IconButton onClick={onClear}>
                <Close />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      component={Paper}
      variant={variant}
      className={hasError ? classes.errorPaper : undefined}>
      <Box p={4}>
        <Grid
          container
          alignItems='center'
          justifyContent='center'
          direction='column'
          spacing={2}>
          <Grid item>
            <Typography color='textSecondary' variant='body2'>
              <IntlMessages id='nftLeague.chooseYourNft' />
            </Typography>
          </Grid>
          <Grid item>
            <Button variant='contained' onClick={onClick} color='primary'>
              <IntlMessages id='nftLeague.choose' />
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default CoinSelect;
