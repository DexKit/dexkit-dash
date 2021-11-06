import React from 'react';

import {useFormik} from 'formik';
import {useIntl} from 'react-intl';
import IntlMessages from '@crema/utility/IntlMessages';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import {makeStyles} from '@material-ui/core';

import ResetIcon from '@material-ui/icons/RotateLeft';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

type FormProps = {
  defaultDarkMode: boolean;
  brandColor?: string;
  brandColorDark?: string;
};

const useStyles = makeStyles((theme) => ({
  root: {margin: theme.spacing(5)},
  inputColor: {
    width: '15%',
    marginLeft: 'auto',
    height: theme.spacing(8),
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
  },
}));

type Props = {data: FormProps; setData: any};

const ThemeStep: React.FC<Props> = (props) => {
  const classes = useStyles();
  const {messages} = useIntl();

  const formik = useFormik({
    initialValues: props.data,
    onSubmit: console.log,
  });

  React.useEffect(() => {
    props.setData(formik.values);
    // eslint-disable-next-line
  }, [formik.values]);

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
                <IntlMessages id='app.myApps.customizeAggregatorThemeColors' />
              </Typography>
            </Grid>
            <Grid item md={8} xs={6}>
              <FormGroup>
                <FormControlLabel
                  name='defaultDarkMode'
                  value={formik.values.defaultDarkMode}
                  onChange={formik.handleChange}
                  control={<Checkbox />}
                  label={`${messages['app.myApps.darkModeAsDefault']}`}
                />
              </FormGroup>
            </Grid>

            <Grid item md={4} xs={6} style={{textAlignLast: 'right'}}>
              <Button
                startIcon={<ResetIcon />}
                variant='contained'
                size='small'
                onClick={formik.handleReset}>
                <IntlMessages id='app.myApps.resetAll' />
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <OutlinedInput
                  name='brandColor'
                  type='color'
                  startAdornment={
                    <FormLabel style={{color: '#fff'}}>
                      <IntlMessages id='app.myApps.brandColor' />
                    </FormLabel>
                  }
                  endAdornment={
                    <InputAdornment position='end'>
                      <ArrowDownIcon />
                    </InputAdornment>
                  }
                  style={{justifyContent: 'space-between'}}
                  inputProps={{className: classes.inputColor}}
                  value={formik.values.brandColor}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </Grid>

            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <OutlinedInput
                  style={{justifyContent: 'space-between'}}
                  name='brandColorDark'
                  type='color'
                  startAdornment={
                    <FormLabel style={{color: '#fff'}}>
                      <IntlMessages id='app.myApps.brandColorDark' />
                    </FormLabel>
                  }
                  endAdornment={
                    <InputAdornment position='end'>
                      <ArrowDownIcon />
                    </InputAdornment>
                  }
                  inputProps={{className: classes.inputColor}}
                  value={formik.values.brandColorDark}
                  onChange={formik.handleChange}
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
