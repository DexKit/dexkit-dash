import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
  Collapse,
  IconButton,
  InputAdornment,
  useScrollTrigger,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Button,
  Paper,
  Switch,
  FormControl,
  InputLabel,
} from '@material-ui/core';

import AssetCard from '../AssetCard';
import {useHistory, useParams} from 'react-router';
import AssetsSkeleton from '../AssetsSkeleton';
import PageTitle from 'shared/components/PageTitle';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import useFetch from 'use-http';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import CollectionListSkeleton from '../CollectionListSkeleton';
import useIsMounted from 'hooks/useIsMounted';
import CollectionsCard from '../CollectionsList';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import FilterListIcon from '@material-ui/icons/FilterList';
import ErrorIcon from '@material-ui/icons/Error';

import _ from 'lodash';
import CollectionsList from '../CollectionsList';
import {truncateTokenAddress} from 'utils';
import SearchIcon from '@material-ui/icons/Search';
import {useIntersect} from 'hooks/useIntersect';
import {FormatListBulletedOutlined} from '@material-ui/icons';
import {getWindowUrl} from 'utils/browser';

interface RouteParams {
  address: string;
  token: string;
}

const useStyles = makeStyles((theme) => ({
  boldText: {
    fontWeight: 700,
  },
  active: {
    borderColor: theme.palette.primary.main,
  },
}));

export default () => {
  const theme = useTheme();
  const userAddress = useDefaultAccount();
  const isUpXs = useMediaQuery(theme.breakpoints.up('sm'));
  const classes = useStyles();
  const history = useHistory();
  const {messages} = useIntl();
  const {address, token}: RouteParams = useParams();

  return (
    <Box pt={{xs: 8}}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box mb={2}>
                    <Grid container spacing={2}>
                      <Grid item sm={4}>
                        <Paper className={classes.active} variant='outlined'>
                          <Box
                            alignItems='center'
                            flexDirection='column'
                            py={2}
                            display='flex'>
                            <Typography
                              variant='body1'
                              style={{fontWeight: 800}}>
                              Set Price
                            </Typography>
                            <Typography variant='body2'>
                              Sell at a fixed or declining price
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                      <Grid item sm={4}>
                        <Paper variant='outlined'>
                          <Box
                            alignItems='center'
                            flexDirection='column'
                            py={2}
                            display='flex'>
                            <Typography
                              variant='body1'
                              className={classes.boldText}>
                              Set Price
                            </Typography>
                            <Typography variant='body2'>
                              Sell at a fixed or declining price
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                      <Grid item sm={4}>
                        <Paper variant='outlined'>
                          <Box
                            alignItems='center'
                            flexDirection='column'
                            py={2}
                            display='flex'>
                            <Typography
                              variant='body1'
                              className={classes.boldText}>
                              Set Price
                            </Typography>
                            <Typography variant='body2'>
                              Sell at a fixed or declining price
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Grid
                    container
                    justify='space-between'
                    alignItems='center'
                    spacing={2}>
                    <Grid item>
                      <Typography variant='body1' className={classes.boldText}>
                        Price
                      </Typography>
                      <Typography variant='body2' color='textSecondary'>
                        Will be on sale until you transfer this item or cancel
                        it.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <TextField
                        size='medium'
                        variant='outlined'
                        label='Amount'
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid
                    container
                    justify='space-between'
                    alignItems='center'
                    spacing={2}>
                    <Grid item>
                      <Typography variant='body1' className={classes.boldText}>
                        Schedule for a future time
                      </Typography>
                      <Typography variant='body2' color='textSecondary'>
                        You can schedule this listing to only be buyable at a
                        future date
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Switch color='primary' />
                    </Grid>
                  </Grid>
                  <Collapse in>
                    <Box py={2}>
                      <FormControl variant='outlined'>
                        <InputLabel>Date</InputLabel>
                        <Select label='Date' variant='outlined'></Select>
                      </FormControl>
                    </Box>
                  </Collapse>
                </Grid>
                <Grid item xs={12}>
                  <Grid
                    container
                    justify='space-between'
                    alignItems='center'
                    spacing={2}>
                    <Grid item>
                      <Typography variant='body1' className={classes.boldText}>
                        Privacy
                      </Typography>
                      <Typography variant='body2' color='textSecondary'>
                        You can keep your listing public, or your can specify
                        one address that's allowed to buy it.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Switch color='primary' />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>asds</CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
