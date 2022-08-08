import React from 'react';

import Grid from '@material-ui/core/Grid';
import {FormikProps} from 'formik';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {getFieldProperties} from 'modules/MyApps/Wizard/aggregator/utils/fieldProperties';
import {InfoComponent} from '../../shared/Buttons/infoComponent';
import {HELP_TEXT} from '../utils/helpText';

interface GeneralFormProps {
  formik: FormikProps<any>;
}

export const GeneralForm = (props: GeneralFormProps) => {
  const {formik} = props;
  return (
    <Grid container spacing={6}>
      <Grid item xs={6} md={6} sm={6}>
        <TextField
          fullWidth
          id='name'
          name='name'
          label='Name'
          variant='outlined'
          value={formik.values.name}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.name)}
          helperText={formik.errors.name}
          InputLabelProps={{
            // shrink: placeholder != null,
            shrink: true,
          }}
          InputProps={{
            endAdornment: <InfoComponent text={HELP_TEXT.name[0]} />,
          }}
        />
      </Grid>
      <Grid item xs={6} md={6} sm={6}>
        <TextField
          fullWidth
          id='logo'
          name='logo'
          label='Logo'
          variant='outlined'
          value={formik.values.logo}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.logo)}
          helperText={formik.errors.logo}
          InputProps={{
            endAdornment: <InfoComponent text={HELP_TEXT.logo[0]} />,
          }}
        />
      </Grid>
      <Grid item xs={6} md={6} sm={6}>
        <TextField
          fullWidth
          id='logo_dark'
          name='logo_dark'
          label='Logo Dark'
          variant='outlined'
          value={formik.values.logo_dark}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.logo_dark)}
          helperText={formik.errors.logo_dark}
          InputProps={{
            endAdornment: <InfoComponent text={HELP_TEXT.logo_dark[0]} />,
          }}
        />
      </Grid>
      <Grid item xs={6} md={6} sm={6}>
        <TextField
          fullWidth
          id='domain'
          name='domain'
          label='Domain'
          variant='outlined'
          value={formik.values.domain}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.domain)}
          helperText={formik.errors.domain}
          InputProps={{
            endAdornment: <InfoComponent text={HELP_TEXT.domain[0]} />,
          }}
        />
      </Grid>
      <Grid item xs={6} md={6} sm={6}>
        <TextField
          fullWidth
          id='share_image_url'
          name='share_image_url'
          label='Share Image URL'
          variant='outlined'
          value={formik.values.share_image_url}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.share_image_url)}
          helperText={formik.errors.share_image_url}
          InputProps={{
            endAdornment: (
              <InfoComponent
                text={
                  HELP_TEXT.share_image_url &&
                  (HELP_TEXT.share_image_url[0] as string)
                }
              />
            ),
          }}
        />
      </Grid>
      <Grid item xs={6} md={6} sm={6}>
        <TextField
          fullWidth
          id='feeRecipient'
          name='feeRecipient'
          label='Affiliate'
          variant='outlined'
          value={formik.values.feeRecipient}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.feeRecipient)}
          helperText={formik.errors.feeRecipient}
          InputProps={{
            endAdornment: <InfoComponent text={HELP_TEXT.feeRecipient[0]} />,
          }}
        />
      </Grid>
      <Grid item xs={6} md={6} sm={6}>
        <TextField
          fullWidth
          type='number'
          id='buyTokenPercentage'
          name='buyTokenPercentage'
          label='Buy Token Percentage'
          variant='outlined'
          value={formik.values.buyTokenPercentage}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.buyTokenPercentage)}
          helperText={formik.errors.buyTokenPercentage}
          inputProps={{
            min: getFieldProperties('buyTokenPercentage')?.min || 0.0,
            max: getFieldProperties('buyTokenPercentage')?.max || 100,
            step: getFieldProperties('buyTokenPercentage')?.step || 0.1,
            endAdornment: (
              <InfoComponent text={HELP_TEXT.buyTokenPercentage[0]} />
            ),
          }}
        />
      </Grid>
      <Grid item xs={6} md={6} sm={6}>
        <TextField
          fullWidth
          type='number'
          id='default_slippage'
          name='default_slippage'
          label='Default Slippage'
          variant='outlined'
          value={formik.values.default_slippage}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.default_slippage)}
          helperText={formik.errors.default_slippage}
          inputProps={{
            min: getFieldProperties('default_slippage')?.min || 0.0,
            max: getFieldProperties('default_slippage')?.max || 100,
            step: getFieldProperties('default_slippage')?.step || 0.1,
            endAdornment: (
              <InfoComponent
                text={
                  HELP_TEXT?.default_slippage
                    ? (HELP_TEXT.default_slippage[0] as string)
                    : ''
                }
              />
            ),
          }}
        />
      </Grid>
      <Grid item xs={6} md={6} sm={6}>
        <Box display={'flex'} alignContent={'center'} alignItems={'center'}>
          <FormControlLabel
            value={formik.values.bsc_as_default}
            control={
              <Checkbox
                defaultChecked={formik.values.bsc_as_default}
                onChange={formik.handleChange}
                name={'bsc_as_default'}
                id='bsc_as_default'
                color='primary'
              />
            }
            label={'BSC as Default'}
            labelPlacement='end'
          />
          <InfoComponent
            text={HELP_TEXT?.bsc_as_default ? HELP_TEXT?.bsc_as_default[0] : ''}
          />
        </Box>
      </Grid>
      <Grid item xs={6} md={6} sm={6}>
        <Box display={'flex'} alignContent={'center'} alignItems={'center'}>
          <FormControlLabel
            value={formik.values.matic_as_default}
            control={
              <Checkbox
                defaultChecked={formik.values.matic_as_default}
                onChange={formik.handleChange}
                name={'matic_as_default'}
                id='matic_as_default'
                color='primary'
              />
            }
            label={'MATIC as Default'}
            labelPlacement='end'
          />
          <InfoComponent
            text={
              HELP_TEXT?.matic_as_default ? HELP_TEXT?.matic_as_default[0] : ''
            }
          />
        </Box>
      </Grid>
      <Grid item xs={6} md={6} sm={6}>
        <Box display={'flex'} alignContent={'center'} alignItems={'center'}>
          <FormControlLabel
            value={formik.values.avax_as_default}
            control={
              <Checkbox
                defaultChecked={formik.values.avax_as_default}
                onChange={formik.handleChange}
                name={'avax_as_default'}
                id='avax_as_default'
                color='primary'
              />
            }
            label={'AVAX as Default'}
            labelPlacement='end'
          />
          <InfoComponent
            text={
              HELP_TEXT?.avax_as_default ? HELP_TEXT?.avax_as_default[0] : ''
            }
          />
        </Box>
      </Grid>
      <Grid item xs={6} md={6} sm={6}>
        <Box display={'flex'} alignContent={'center'} alignItems={'center'}>
          <FormControlLabel
            value={formik.values.hide_powered_by_dexkit}
            control={
              <Checkbox
                defaultChecked={formik.values.hide_powered_by_dexkit}
                onChange={formik.handleChange}
                name={'hide_powered_by_dexkit'}
                id='hide_powered_by_dexkit'
                color='primary'
              />
            }
            label={'Hide Powered By DexKit'}
            labelPlacement='end'
          />
          <InfoComponent
            text={
              HELP_TEXT?.hide_powered_by_dexkit
                ? HELP_TEXT?.hide_powered_by_dexkit[0]
                : ''
            }
          />
        </Box>
      </Grid>
      <Grid item xs={6} md={6} sm={6}>
        <Box display={'flex'} alignContent={'center'} alignItems={'center'}>
          <FormControlLabel
            value={formik.values.fantom_as_default}
            control={
              <Checkbox
                defaultChecked={formik.values.fantom_as_default}
                onChange={formik.handleChange}
                name={'fantom_as_default'}
                id='fantom_as_default'
                color='primary'
              />
            }
            label={'FANTOM as Default'}
            labelPlacement='end'
          />
          <InfoComponent
            text={
              HELP_TEXT?.fantom_as_default
                ? HELP_TEXT?.fantom_as_default[0]
                : ''
            }
          />
        </Box>
      </Grid>
      <Grid item xs={6} md={6} sm={6}>
        <Box display={'flex'} alignContent={'center'} alignItems={'center'}>
          <FormControlLabel
            value={formik.values.hide_tabs}
            control={
              <Checkbox
                defaultChecked={formik.values.hide_tabs}
                onChange={formik.handleChange}
                name={'hide_tabs'}
                id='hide_tabs'
                color='primary'
              />
            }
            label={'Hide tabs'}
            labelPlacement='end'
          />
          <InfoComponent
            text={HELP_TEXT?.hide_tabs ? HELP_TEXT?.hide_tabs[0] : ''}
          />
        </Box>
      </Grid>
      <Grid item xs={6} md={6} sm={6}>
        <Box display={'flex'} alignContent={'center'} alignItems={'center'}>
          <FormControlLabel
            value={formik.values.hide_network_selector}
            control={
              <Checkbox
                defaultChecked={formik.values.hide_network_selector}
                onChange={formik.handleChange}
                name={'hide_network_selector'}
                id='hide_network_selector'
                color='primary'
              />
            }
            label={'Hide network selector'}
            labelPlacement='end'
          />
          <InfoComponent
            text={
              HELP_TEXT?.hide_network_selector
                ? HELP_TEXT?.hide_network_selector[0]
                : ''
            }
          />
        </Box>
      </Grid>
      <Grid item xs={6} md={6} sm={6}>
        <Box display={'flex'} alignContent={'center'} alignItems={'center'}>
          <FormControlLabel
            value={formik.values.hide_network_dropdown}
            control={
              <Checkbox
                defaultChecked={formik.values.hide_network_dropdown}
                onChange={formik.handleChange}
                name={'hide_network_dropdown'}
                id=' hide_network_dropdown'
                color='primary'
              />
            }
            label={'Hide network dropdown'}
            labelPlacement='end'
          />
          <InfoComponent
            text={
              HELP_TEXT?.hide_network_dropdown
                ? HELP_TEXT?.hide_network_dropdown[0]
                : ''
            }
          />
        </Box>
      </Grid>
      <Grid item xs={6} md={6} sm={6}>
        <TextField
          fullWidth
          id='default_token_address'
          name='default_token_address'
          label='ETH default token address'
          variant='outlined'
          value={formik.values.default_token_address}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.default_token_address)}
          helperText={formik.errors.default_token_address}
          InputProps={{
            endAdornment: (
              <InfoComponent
                text={
                  HELP_TEXT?.default_token_address
                    ? HELP_TEXT?.default_token_address[0]
                    : ''
                }
              />
            ),
          }}
        />
      </Grid>
      <Grid item xs={6} md={6} sm={6}>
        <TextField
          fullWidth
          id='default_token_address_bsc'
          name='default_token_address_bsc'
          label='BSC default token address'
          variant='outlined'
          value={formik.values.default_token_address_bsc}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.default_token_address_bsc)}
          helperText={formik.errors.default_token_address_bsc}
          InputProps={{
            endAdornment: (
              <InfoComponent
                text={
                  HELP_TEXT?.default_token_address_bsc
                    ? HELP_TEXT?.default_token_address_bsc[0]
                    : ''
                }
              />
            ),
          }}
        />
      </Grid>
      <Grid item xs={6} md={6} sm={6}>
        <TextField
          fullWidth
          id='default_token_address_matic'
          name='default_token_address_matic'
          label='Matic default token address'
          variant='outlined'
          value={formik.values.default_token_address_matic}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.default_token_address_matic)}
          helperText={formik.errors.default_token_address_matic}
          InputProps={{
            endAdornment: (
              <InfoComponent
                text={
                  HELP_TEXT?.default_token_address_matic
                    ? HELP_TEXT?.default_token_address_matic[0]
                    : ''
                }
              />
            ),
          }}
        />
      </Grid>
      <Grid item xs={6} md={6} sm={6}>
        <TextField
          fullWidth
          id='default_token_address_avax'
          name='default_token_address_avax'
          label='Avax default token address'
          variant='outlined'
          value={formik.values.default_token_address_avax}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.default_token_address_avax)}
          helperText={formik.errors.default_token_address_avax}
          InputProps={{
            endAdornment: (
              <InfoComponent
                text={
                  HELP_TEXT?.default_token_address_avax
                    ? HELP_TEXT?.default_token_address_avax[0]
                    : ''
                }
              />
            ),
          }}
        />
      </Grid>
      <Grid item xs={6} md={6} sm={6}>
        <TextField
          fullWidth
          id='default_token_address_fantom'
          name='default_token_address_fantom'
          label='Fantom default token Address'
          variant='outlined'
          value={formik.values.default_token_address_fantom}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.default_token_address_fantom)}
          helperText={formik.errors.default_token_address_fantom}
          InputProps={{
            endAdornment: (
              <InfoComponent
                text={
                  HELP_TEXT?.default_token_address_fantom
                    ? HELP_TEXT?.default_token_address_fantom[0]
                    : ''
                }
              />
            ),
          }}
        />
      </Grid>
    </Grid>
  );
};
