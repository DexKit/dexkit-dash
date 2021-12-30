import React from 'react';
import {
  Card,
  Grid,
  CardContent,
  Box,
  Button,
  Paper,
  Typography,
  makeStyles,
  CircularProgress,
} from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IntlMessages from '@crema/utility/IntlMessages';

const useStyles = makeStyles((theme) => ({
  img: {
    height: theme.spacing(16),
    width: theme.spacing(16),
    borderRadius: '50%',
  },
}));

export interface DeployStepProps {
  onBack: () => void;
  onFinalize: () => void;
  values: any;
  items: any[];
  uploadId: string;
}

export const DeployStep = (props: DeployStepProps) => {
  const {values, items, onBack, onFinalize, uploadId} = props;

  const classes = useStyles();

  return (
    <Grid container justify='center' spacing={4}>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography gutterBottom variant='h5'>
                  <IntlMessages id='app.wizard.summary' />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'>
                  <Typography variant='body1'>
                    <IntlMessages id='app.wizard.name' />
                  </Typography>
                  <Typography variant='body1'>{values.name}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'>
                  <Typography variant='body1'>
                    <IntlMessages id='app.wizard.symbol' />
                  </Typography>
                  <Typography variant='body1'>{values.symbol}</Typography>
                </Box>
              </Grid>
              {values.url !== '' ? (
                <Grid item xs={12}>
                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='space-between'>
                    <Typography variant='body1'>
                      <IntlMessages id='app.wizard.externalURL' />
                    </Typography>
                    <Typography variant='body1'>{values.url}</Typography>
                  </Box>
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'>
                  <Typography variant='body1'>
                    <IntlMessages id='app.wizard.description' />
                  </Typography>
                  <Typography variant='body1'>{values.description}</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Grid container spacing={4}>
          {items.map((item, index: number) => (
            <Grid key={index} item xs={12}>
              <Paper>
                <Box p={4}>
                  <Grid
                    container
                    alignContent='center'
                    spacing={4}
                    alignItems='center'>
                    <Grid item>
                      {item.image ? (
                        <img
                          alt=''
                          className={classes.img}
                          src={URL.createObjectURL(item.image)}
                        />
                      ) : (
                        'img'
                      )}
                    </Grid>
                    <Grid item xs>
                      <Typography variant='h5'>{item.name}</Typography>
                      <Typography>{item.description}</Typography>
                    </Grid>
                    <Grid item>
                      {item.id === uploadId ? (
                        <CircularProgress color='inherit' />
                      ) : null}
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={12} sm={10}>
        <Paper>
          <Box p={4}>
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={onBack}
                variant='outlined'>
                <IntlMessages id='app.wizard.back' />
              </Button>
              <Button
                startIcon={<DoneIcon />}
                onClick={onFinalize}
                variant='contained'
                color='primary'>
                <IntlMessages id='app.wizard.finalize' />
              </Button>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DeployStep;
