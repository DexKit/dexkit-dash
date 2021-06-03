import React, {useCallback, useEffect, useState} from 'react';
import GridContainer from '@crema/core/GridContainer';
import {
  Grid, 
  TextField, 
} from '@material-ui/core';

import { ConfigFileExchange, GeneralConfig, SocialNetworks} from 'types/myApps';
import { WizardProps } from '../shared';
import isURL from 'validator/lib/isURL';
import {isAddress} from '@ethersproject/address';
import {capitalize} from 'utils/text';
import  { CustomLabel } from 'shared/components/Wizard/Label';
import { ZERO_ADDRESS } from 'shared/constants/Blockchain';
import { error } from '../shared/';
import { HELP_TEXT } from './helpText';
import { getHelpText } from '../shared';
import { InfoComponent } from '../shared/Buttons/infoComponent';
import { WizardData } from '.';

interface GeneralFormProps {
  title: string;
  fields: GeneralConfig;
}

type Props = GeneralFormProps & WizardProps<ConfigFileExchange, keyof ConfigFileExchange>;

// const contactsType = ['Telegram Url', 'Twitter Url', 'Facebook Url', 'Discord Url', 'Reddit Url', 'BitcoinTalk Url']

const GeneralForm: React.FC<Props> = (props) => {
  const {
    fields: startData,
    changeIssuerForm,
    validator,
    isValid: startValidation,
    editable: startEditable
  } = props;
  const [errors, setErrors] = useState<error>({});
  const [fields, setFields] = useState<GeneralConfig>(startData);
  const [valid, setValid] = useState<boolean>(startValidation);
  const [editable] = useState(Boolean(startEditable));
  const maxPercente = 0.5;
  const changeFields = (
    $event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string | undefined,
    key: string,
  ) => {
    const value = typeof($event) === 'string' ? $event : $event?.target?.value;
    setFields({
      ...fields,
      [key]: value,
    });
  };

  const changeSocialFields = (
    $event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: string,
  ) => {
    const {social} = fields;

    setFields({
      ...fields,
      social: {
        ...social,
        [key]: $event.target.value,
      },
    });
  };

  const urlValidator = (url: string) => {
    return isURL(url);
  };

  const validatorToOtherFields = useCallback(
    (key: keyof GeneralConfig, errors: error) => {
      const {title, icon, domain, feeRecipient, feePercentage} = fields;
      if (errors != null) {
        switch (key) {
          case 'title': {
            errors.title =
              (title ?? '').length > 2 ? undefined : 'Title invalid!';
            break;
          }
          case 'icon': {
            errors.icon = urlValidator(icon ?? '')
              ? undefined
              : 'Icon URL is invalid!';
            break;
          }
          case 'domain': {
            errors.domain = urlValidator(domain ?? '')
              ? undefined
              : 'Domain URL is invalid!';
            break;
          }
          case 'feePercentage': {
            const perc = Number(feePercentage);
              errors.feePercentage =
              (perc < 0 || perc > 100) || isNaN(perc) || !isFinite(perc)
                ? 'Fee Percentage number is invalid'
                : (perc > maxPercente ? `The value max to Feet Percentage is ${maxPercente}` : undefined);
            break;
          }
          case 'feeRecipient': {
            errors.feeRecipient = isAddress(feeRecipient ?? '')
              ? undefined
              : 'Invalid Fee Address';
            break;
          }
        }
        const _valid = Object.keys(fields)
          .filter((k) => !(`${k}` in (fields?.social ?? {})))
          .reduce((pre, cur): boolean => {
            type k = keyof typeof fields;
            const fieldValid =
              fields[cur as k] != null &&
              (fields[cur as k]?.toString()?.length ?? 0) > 0;
            return pre && errors[cur] == null && fieldValid;
          }, true);
        setValid(_valid);
        // setErrors({
        //   ...errors,
        // });
      }
      return errors;
    },
    [fields],
  );

  const socialvalidator = useCallback(
    (key: keyof SocialNetworks) => {
      const {social} = fields;
      if (social != null && errors) {
        type k = keyof typeof social;
        const socialUrl: string | undefined =
          social != null ? social[key as k] : undefined;
        const errorMsg =
          socialUrl != null && socialUrl.length > 0
            ? !urlValidator(socialUrl)
              ? `${capitalize(key, '_', ' ')} is invalid!`
              : undefined
            : undefined;
        errors[key as k] = errorMsg;
        setValid(errors[key as k] != null ? false : valid);
        setErrors({
          ...errors,
        });
      }
    },
    [fields, errors, valid],
  );

  useEffect(() => {
    const {social, title, domain} = fields;
    // const _editable = Boolean(title) && Boolean(domain);
    // if(!editable){
    //   setEditable(!_editable);
    //   changeIssuerForm('editable', _editable === false);
    // }
    const _errors: error = Object.keys(social ?? {}).reduce(
      (pre, cur) => {
        type k = keyof typeof social;
        return {
          ...pre,
          [cur]: errors != null ? errors[cur as k] : undefined,
        } as error;
      },
      {
        title: errors?.title,
        icon: errors?.icon,
        domain: errors?.domain,
        feeRecipient: errors?.feeRecipient,
        feePercentage: errors?.feePercentage,
      } as error,
    );
    // setErrors(_errors);
    const keys = Object.keys(_errors ?? {});
    keys.forEach( (k,i) => {
      validatorToOtherFields(k as keyof GeneralConfig, _errors ?? {});
    })
  }, []);

  useEffect(() => {
    if(Boolean(editable)){
      changeIssuerForm(WizardData.GENERAL as keyof ConfigFileExchange, fields);
    }
  }, [fields, changeIssuerForm, editable]);

  useEffect(() => {
    validator(valid);
  }, [valid, validator]);

  return (
    <GridContainer>
      <Grid item xs={12} md={6} sm={6} key="title">
      <TextField
        type='text'
        key='exchange-title'
        id='exchange-title'
        fullWidth
        label={
          <CustomLabel required={true}>
            Title
          </CustomLabel>
        }
        variant='outlined'
        value={fields.title}
        helperText={!valid ? errors?.title : undefined}
        error={errors?.title != null}
        onBlur={($e) => {
          if(!Boolean(editable)){
            return;
          }
          validatorToOtherFields('title', errors);
          setErrors({ ...errors });
          $e.preventDefault()
        }}
        onChange={($e) => {
          if(!Boolean(editable)){
            return;
          }
          changeFields($e, 'title');
          $e.preventDefault()
        }}
        disabled={!Boolean(editable)}
        InputProps={{ endAdornment: (<InfoComponent text={getHelpText(HELP_TEXT, 'title', 0)}/>)}}
      />
      </Grid>
      <Grid item xs={12} md={6} sm={6} key="icon">
        <TextField
          type='text'
          key='exchange-icon'
          id='exchange-icon'
          fullWidth
          label={
            <CustomLabel required={true}>
              Icon URL
            </CustomLabel>
          }
          variant='outlined'
          placeholder={'https://pin.it/73XYbnZ'}
          value={fields.icon}
          helperText={!valid ? errors?.icon : undefined}
          error={errors?.icon != null}
          onBlur={($e) => {
            if(!Boolean(editable)){
              return;
            }
            validatorToOtherFields('icon', errors);
            setErrors({ ...errors });
          }}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={($e) => {
            if(!Boolean(editable)){
              return;
            }
            changeFields($e, 'icon');
          }}
          disabled={!Boolean(editable)}
          InputProps={{ endAdornment: (<InfoComponent text={getHelpText(HELP_TEXT, 'icon', 0)}/>)}}
        />
      </Grid>
      <Grid item xs={12} md={6} sm={6} key="domain">
        <TextField
          type='text'
          key='exchange-domain'
          id='exchange-domain'
          fullWidth
          label={<CustomLabel text="Domain URL" required={true} />}
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="http://www.domainofmyproject.com"
          variant='outlined'
          value={fields.domain}
          helperText={!valid ? errors?.domain : undefined}
          error={errors?.domain != null}
          onBlur={($e) => {
            if(!Boolean(editable)){
              return;
            }
            validatorToOtherFields('domain', errors);
            setErrors({ ...errors });
          }}
          onChange={($e) => {
            if(!Boolean(editable)){
              return;
            }
            changeFields($e, 'domain');
          }}
          disabled={!Boolean(editable)}
          InputProps={{ endAdornment: (<InfoComponent text={getHelpText(HELP_TEXT, 'domain', 0)}/>)}}
        />
      </Grid>
      <Grid item xs={12} md={6} sm={6} key="feeRecipient">
        <TextField
          type='text'
          key='exchange-feeRecipient'
          id='exchange-feeRecipient'
          fullWidth
          label={<CustomLabel text="Fee Address" required={true} />}
          placeholder={ZERO_ADDRESS}
          InputLabelProps={{
            shrink: true,
          }}
          variant='outlined'
          value={fields.feeRecipient}
          helperText={!valid ? errors?.feeRecipient : undefined}
          error={errors?.feeRecipient != null}
          onBlur={($e) => {
            if(!Boolean(editable)){
              return;
            }
            validatorToOtherFields('feeRecipient', errors);
            setErrors({ ...errors });
          }}
          onChange={($e) => {
            if(!Boolean(editable)){
              return;
            }
            changeFields($e, 'feeRecipient');
          }}
          disabled={!Boolean(editable)}
          InputProps={{ endAdornment: (<InfoComponent text={getHelpText(HELP_TEXT, 'feeRecipient', 0)}/>)}}
        />
      </Grid>
      <Grid item xs={12} md={6} sm={6} key="feePercentage">
        <TextField
          type="number"
          key='exchange-feePercentage'
          id='exchange-feePercentage'
          fullWidth
          label={<CustomLabel text="Fee Percentage" required={true} />}
          placeholder="0.0% - 0.5%"
          variant='outlined'
          value={fields.feePercentage}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={
            {
              min: 0.0,
              max: maxPercente,
              step: 0.001
            }
          }
          helperText={!valid ? errors?.feePercentage : undefined}
          error={errors?.feePercentage != null}
          onBlur={($e) => {
            if(!Boolean(editable)){
              return;
            }
            validatorToOtherFields('feePercentage', errors);
            setErrors({ ...errors });
          }}
          onChange={($e) => {
            if(!Boolean(editable)){
              return;
            }
            changeFields($e, 'feePercentage');
          }}
          disabled={!Boolean(editable)}
          // InputProps={{
          //   endAdornment: <InputAdornment position="end">%</InputAdornment>,
          // }}
          InputProps={{ endAdornment: (<InfoComponent text={getHelpText(HELP_TEXT, 'feePercentage', 0)}/>)}}
        />

      </Grid>

      {Object.keys(fields?.social ?? {}).map((key: string, i) => (
        <Grid item xs={12} md={6} sm={6} key={`exchange-${key.replace('_', '-').toLowerCase()}`}>
          <TextField
            type='url'
            error={errors != null ? errors[key] != null : false}
            helperText={errors != null ? errors[key] : undefined}
            id={`exchange-${key.replace('_', '-').toLowerCase()}`}
            key={`exchange-${key.replace('_', '-').toLowerCase()}`}
            fullWidth
            label={capitalize(`${key.replace('_', ' ').toLowerCase()}`)}
            variant='outlined'
            value={fields?.social ? Object.values(fields?.social)[i] : ''}
            onBlur={($e) => {
              if(!Boolean(editable)){
                return;
              }
              type k = keyof typeof fields.social;
              socialvalidator(key as k);
            }}
            onChange={($e) => {
              if(!Boolean(editable)){
                return;
              }
              changeSocialFields($e, key);
            }}
            disabled={!Boolean(editable)}
            InputProps={{ endAdornment: (<InfoComponent text={`Enter with a valid ${capitalize(`${key.replace('_', ' ').toLowerCase()}`)}`}/>)}}
          />
        </Grid>
      ))}
    </GridContainer>
  );
};

export default GeneralForm;
