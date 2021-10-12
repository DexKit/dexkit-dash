import React from 'react';

import {useFormik} from 'formik';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import {makeStyles} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';

import ResetIcon from '@material-ui/icons/RotateLeft';
import InfoIcon from '@material-ui/icons/InfoOutlined';

type FormProps = {
  defaultDarkMode: boolean;
  brandColor?: string;
  brandColorDark?: string;
};

const useStyles = makeStyles((theme) => ({
  root: {margin: theme.spacing(5)},
}));

const ThemeStep: React.FC = () => {
  const classes = useStyles();

  // TODO: Send info!
  const handleSubmit = (formData: FormProps) => {
    alert(JSON.stringify(formData));
  };

  const formik = useFormik({
    initialValues: {
      defaultDarkMode: false,
      brandColor: undefined,
      brandColorDark: undefined,
    },
    onSubmit: handleSubmit,
  });

  return (
    <Grid
      container
      spacing={4}
      className={classes.root}
      justifyContent='space-between'>
      <form
        onSubmit={formik.handleSubmit}
        autoComplete='off'
        style={{width: '100%'}}>
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
                  name='defaultDarkMode'
                  value={formik.values.defaultDarkMode}
                  onChange={formik.handleChange}
                  control={<Checkbox defaultChecked />}
                  label='Dark Mode as Default'
                />
              </FormGroup>
            </Grid>

            <Grid item xs={4} style={{textAlignLast: 'right'}}>
              <Button
                startIcon={<ResetIcon />}
                variant='contained'
                size='small'
                onClick={formik.handleReset}>
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
                <OutlinedInput
                  name='brandColor'
                  type='color'
                  value={formik.values.brandColor}
                  onChange={formik.handleChange}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton edge='end' size='small'>
                        <InfoIcon style={{color: '#646672'}} />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel style={{marginBottom: 5, color: '#fff'}}>
                  Brand Color Dark
                </FormLabel>
                <OutlinedInput
                  name='brandColorDark'
                  type='color'
                  value={formik.values.brandColorDark}
                  onChange={formik.handleChange}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton edge='end' size='small'>
                        <InfoIcon style={{color: '#646672'}} />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};

export default ThemeStep;
