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

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#2E3243',
  },
  chip: {
    marginRight: theme.spacing(2),
    backgroundColor: '#525C75',
  },
  actual: {
    height: theme.spacing(3),
    borderRadius: theme.spacing(1.5),
    backgroundColor: '#FFA552',
  },
  indicator: {
    height: theme.spacing(3),
    borderRadius: theme.spacing(1.5),
    backgroundColor: '#3C4255',
  },
}));

const StepperHeader: React.FC<Props> = (props) => {
  const classes = useStyles();
  const {steps, activeStep} = props;
  const actualTitle = steps[activeStep].title;

  return (
    <Grid container className={classes.root}>
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
