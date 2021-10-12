import React from 'react';

import {useFormik} from 'formik';

import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import {makeStyles} from '@material-ui/core';

import InfoIcon from '@material-ui/icons/InfoOutlined';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(5),
  },
  radioIcon: {
    fill: '#525C75',
    stroke: '#525C75',
  },
  radioBtn: {
    backgroundColor: '#3A3D4A',
    border: '1px solid #646672',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(3),
    paddingRight: theme.spacing(5),
  },
}));

type FormProps = {
  name?: string;
  logo?: any;
  logoDark?: any;
  buyTokenPerc?: number;
  domain?: string;
  defaultToken?: 'matic' | 'bsc';
  hidePoweredDexKit?: boolean;
  affiliateAddr?: string;
  defaultTokenAddr?: string;
  defaultTokenAddrBSC?: string;
  defaultTokenAddrMatic?: string;
  defaultSlippage?: string;
};

const GeralStep: React.FC = () => {
  const classes = useStyles();

  // TODO: Send info!
  const handleSubmit = (formData: FormProps) => {
    alert(JSON.stringify(formData));
  };

  const formik = useFormik({
    initialValues: {
      name: undefined,
      logo: undefined,
      logoDark: undefined,
      buyTokenPerc: undefined,
      domain: undefined,
      defaultToken: undefined,
      hidePoweredDexKit: false,
      affiliateAddr: undefined,
      defaultTokenAddr: undefined,
      defaultTokenAddrBSC: undefined,
      defaultTokenAddrMatic: undefined,
      defaultSlippage: undefined,
    },
    onSubmit: handleSubmit,
  });

  return (
    <Grid container spacing={4} className={classes.root}>
      <form
        onSubmit={formik.handleSubmit}
        autoComplete='off'
        style={{width: '100%'}}>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required size='small'>
                <FormLabel style={{marginBottom: 5, color: '#fff'}}>
                  Name
                </FormLabel>
                <OutlinedInput
                  name='name'
                  placeholder='Content'
                  value={formik.values.name}
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
            <Grid item md={6} xs={12}>
              <FormControl fullWidth size='small'>
                <FormLabel style={{marginBottom: 5, color: '#fff'}}>
                  Logo
                </FormLabel>
                <OutlinedInput
                  placeholder='Content'
                  type='file'
                  name='logo'
                  value={formik.values.logo}
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

        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth size='small'>
                <FormLabel style={{marginBottom: 5, color: '#fff'}}>
                  Logo Dark
                </FormLabel>
                <OutlinedInput
                  placeholder='Content'
                  type='file'
                  name='logoDark'
                  value={formik.values.logoDark}
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
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required size='small'>
                <FormLabel style={{marginBottom: 5, color: '#fff'}}>
                  Buy Token Percentage
                </FormLabel>
                <OutlinedInput
                  placeholder='Content'
                  name='buyTokenPerc'
                  value={formik.values.buyTokenPerc}
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

        <Grid item xs={12}>
          <FormControl fullWidth required size='small'>
            <FormLabel style={{marginBottom: 5, color: '#fff'}}>
              Domain
            </FormLabel>
            <OutlinedInput
              placeholder='Content'
              name='domain'
              value={formik.values.domain}
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

        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item md={6} xs={12}>
              <RadioGroup
                row
                style={{margin: 10, width: '100%'}}
                name='defaultToken'
                value={formik.values.defaultToken}
                onChange={formik.handleChange}>
                <FormControlLabel
                  className={classes.radioBtn}
                  value='bsc'
                  control={
                    <Radio
                      checkedIcon={<CheckBoxIcon />}
                      icon={<CheckBoxBlankIcon />}
                      className={classes.radioIcon}
                    />
                  }
                  label='Bsc as Default'
                />
                <FormControlLabel
                  className={classes.radioBtn}
                  value='matic'
                  control={
                    <Radio
                      checkedIcon={<CheckBoxIcon />}
                      icon={<CheckBoxBlankIcon />}
                      className={classes.radioIcon}
                    />
                  }
                  label='Matic As Default'
                />
              </RadioGroup>
            </Grid>

            <Grid item md={6} xs={12}>
              <FormGroup style={{margin: 10}}>
                <FormControlLabel
                  className={classes.radioBtn}
                  control={
                    <Checkbox
                      name='hidePoweredDexKit'
                      checked={formik.values.hidePoweredDexKit}
                      onChange={formik.handleChange}
                      className={classes.radioIcon}
                    />
                  }
                  label='Hide Powered By Dexkit'
                />
              </FormGroup>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required size='small'>
                <FormLabel style={{marginBottom: 5, color: '#fff'}}>
                  Affiliate Address
                </FormLabel>
                <OutlinedInput
                  name='affiliateAddr'
                  value={formik.values.affiliateAddr}
                  onChange={formik.handleChange}
                  placeholder='Content'
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
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required size='small'>
                <FormLabel style={{marginBottom: 5, color: '#fff'}}>
                  Default Token Address
                </FormLabel>
                <OutlinedInput
                  name='defaultTokenAddr'
                  value={formik.values.defaultTokenAddr}
                  onChange={formik.handleChange}
                  placeholder='Content'
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

        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required size='small'>
                <FormLabel style={{marginBottom: 5, color: '#fff'}}>
                  Default Token Address BSC
                </FormLabel>
                <OutlinedInput
                  name='defaultTokenAddrBSC'
                  value={formik.values.defaultTokenAddrBSC}
                  onChange={formik.handleChange}
                  placeholder='Content'
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
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required size='small'>
                <FormLabel style={{marginBottom: 5, color: '#fff'}}>
                  Default Token Address matic
                </FormLabel>
                <OutlinedInput
                  name='defaultTokenAddrMatic'
                  value={formik.values.defaultTokenAddrMatic}
                  onChange={formik.handleChange}
                  placeholder='Content'
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

        <Grid item md={6} xs={12} style={{marginTop: 10}}>
          <FormControl fullWidth required size='small'>
            <FormLabel style={{marginBottom: 5, color: '#fff'}}>
              Default Slippage
            </FormLabel>
            <OutlinedInput
              name='defaultSlippage'
              value={formik.values.defaultSlippage}
              onChange={formik.handleChange}
              placeholder='Content'
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
      </form>
    </Grid>
  );
};

export default GeralStep;
