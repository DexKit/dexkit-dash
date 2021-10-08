import React from 'react';

import {GridContainer} from '@crema';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@material-ui/core';

import {makeStyles} from '@material-ui/core';
import ResetIcon from '@material-ui/icons/RotateLeft';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(5),
  },
}));

const ThemeStep: React.FC = () => {
  const classes = useStyles();

  return (
    <GridContainer
      spacing={4}
      className={classes.root}
      justifyContent='space-between'>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='caption'>
              Customize aggregator theme colors:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label='Dark Mode as Default'
              />
            </FormGroup>
          </Grid>

          <Grid item xs={4} style={{textAlignLast: 'right'}}>
            <Button startIcon={<ResetIcon />} variant='contained' size='small'>
              Reset All
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <FormLabel style={{marginBottom: 5, color: '#fff'}}>
                Brand Color
              </FormLabel>
              <Select label='Brand Color' variant='outlined'>
                <MenuItem value={'A'}>A</MenuItem>
                <MenuItem value={'B'}>B</MenuItem>
                <MenuItem value={'C'}>C</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth>
              <FormLabel style={{marginBottom: 5, color: '#fff'}}>
                Brand Color Dark
              </FormLabel>
              <Select label='Brand Color Dark' variant='outlined'>
                <MenuItem value={'A'}>A</MenuItem>
                <MenuItem value={'B'}>B</MenuItem>
                <MenuItem value={'C'}>C</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </GridContainer>
  );
};

export default ThemeStep;
