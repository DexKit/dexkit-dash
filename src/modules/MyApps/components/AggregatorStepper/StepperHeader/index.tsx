import React from 'react';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core';

type Props = {
  steps: {title: string}[];
  activeStep: number;
};

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#2E3243',
  },
  chip: {
    backgroundColor: '#525C75',
  },
  actual: {
    height: 10,
    borderRadius: 8,
    backgroundColor: '#FFA552',
  },
  indicator: {
    height: 10,
    borderRadius: 8,
    backgroundColor: '#3C4255',
  },
}));

const StepperHeader: React.FC<Props> = (props) => {
  const classes = useStyles();
  const {steps, activeStep} = props;
  const actualTitle = steps[activeStep].title;

  return (
    <Grid container className={classes.root}>
      <Grid item xs={6}>
        <Grid container spacing={2}>
          <Grid item xs={1}>
            <Chip label={activeStep} size='medium' className={classes.chip} />
          </Grid>
          <Grid item xs={11}>
            <Typography variant='h5'>{actualTitle}</Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={6} style={{alignSelf: 'center'}}>
        <Grid container spacing={2}>
          {steps.map((step, i) => (
            <Grid item xs={4} key={i} title={step.title}>
              <Box
                className={
                  i !== activeStep ? classes.indicator : classes.actual
                }
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default StepperHeader;
