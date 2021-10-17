import React from 'react';

import {useFormik} from 'formik';

import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';

import {makeStyles} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/InfoOutlined';

import {HELP_TEXT_LINKS} from '../../../Wizard/aggregator/helpText';

type FormProps = {
  about: string;
  analytics: string;
  code: string;
  discord: string;
  docs: string;
  telegram: string;
};

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

type Props = {data: FormProps; setData: any};

const LinksStep: React.FC<Props> = (props) => {
  const classes = useStyles();

  const getHelpText = (field: keyof typeof HELP_TEXT_LINKS) =>
    HELP_TEXT_LINKS[field]?.at(0) || '';

  const formik = useFormik<FormProps>({
    initialValues: props.data,
    onSubmit: console.log,
  });

  React.useEffect(() => {
    props.setData(formik.values);
    // eslint-disable-next-line
  }, [formik.values]);

  return (
    <Grid container spacing={10} className={classes.root}>
      <form
        onSubmit={formik.handleSubmit}
        autoComplete='off'
        style={{width: '100%'}}>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth size='small'>
                <FormLabel style={{marginBottom: 5, color: '#fff'}}>
                  About
                </FormLabel>
                <OutlinedInput
                  name='about'
                  placeholder='https://aboutproject.com'
                  value={formik.values.about}
                  onChange={formik.handleChange}
                  endAdornment={
                    <InputAdornment position='end'>
                      <Tooltip title={getHelpText('about')}>
                        <InfoIcon style={{color: '#646672'}} />
                      </Tooltip>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>

            <Grid item md={6} xs={12}>
              <FormControl fullWidth size='small'>
                <FormLabel style={{marginBottom: 5, color: '#fff'}}>
                  Analytics
                </FormLabel>
                <OutlinedInput
                  placeholder='https://analytics.google.com'
                  name='analytics'
                  value={formik.values.analytics}
                  onChange={formik.handleChange}
                  endAdornment={
                    <InputAdornment position='end'>
                      <Tooltip title={getHelpText('analytics')}>
                        <InfoIcon style={{color: '#646672'}} />
                      </Tooltip>
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
                  Code
                </FormLabel>
                <OutlinedInput
                  name='code'
                  placeholder='https://github.com'
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  endAdornment={
                    <InputAdornment position='end'>
                      <Tooltip title={getHelpText('code')}>
                        <InfoIcon style={{color: '#646672'}} />
                      </Tooltip>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>

            <Grid item md={6} xs={12}>
              <FormControl fullWidth size='small'>
                <FormLabel style={{marginBottom: 5, color: '#fff'}}>
                  Discord
                </FormLabel>
                <OutlinedInput
                  placeholder='https://discord.com/invite/gCRAFhc'
                  name='analytics'
                  value={formik.values.discord}
                  onChange={formik.handleChange}
                  endAdornment={
                    <InputAdornment position='end'>
                      <Tooltip title={getHelpText('discord')}>
                        <InfoIcon style={{color: '#646672'}} />
                      </Tooltip>
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
                  Docs
                </FormLabel>
                <OutlinedInput
                  name='docs'
                  placeholder='https://doc.project.com'
                  value={formik.values.docs}
                  onChange={formik.handleChange}
                  endAdornment={
                    <InputAdornment position='end'>
                      <Tooltip title={getHelpText('docs')}>
                        <InfoIcon style={{color: '#646672'}} />
                      </Tooltip>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>

            <Grid item md={6} xs={12}>
              <FormControl fullWidth size='small'>
                <FormLabel style={{marginBottom: 5, color: '#fff'}}>
                  Telegram
                </FormLabel>
                <OutlinedInput
                  placeholder='https://t.me/project'
                  name='telegram'
                  value={formik.values.telegram}
                  onChange={formik.handleChange}
                  endAdornment={
                    <InputAdornment position='end'>
                      <Tooltip title={getHelpText('telegram')}>
                        <InfoIcon style={{color: '#646672'}} />
                      </Tooltip>
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

export default LinksStep;
