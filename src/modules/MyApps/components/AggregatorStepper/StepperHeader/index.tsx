import React from 'react';

import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core';

type Props = {
  steps: {title: string}[];
  activeStep: number;
};

const useStyles = makeStyles((theme) => ({
  chip: {
    marginRight: theme.spacing(2),
    backgroundColor: theme.palette.secondary.dark,
  },
  actual: {
    height: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.primary.main,
  },
  indicator: {
    height: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#525C75',
  },
}));

const StepperHeader: React.FC<Props> = ({steps, activeStep}) => {
  const classes = useStyles();
  const actualTitle = steps[activeStep].title;

  return (
    <Grid container>
      <Grid item xs={6} sm={8} md={9}>
        <Typography variant='h5'>
          <Chip label={activeStep} size='medium' className={classes.chip} />
          {actualTitle}
        </Typography>
      </Grid>

      <Grid item xs={6} sm={4} md={3} style={{alignSelf: 'center'}}>
        <Grid container spacing={2}>
          {steps.map((step, i) => (
            <Grid item xs={4} key={i} title={step.title}>
              <div
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
