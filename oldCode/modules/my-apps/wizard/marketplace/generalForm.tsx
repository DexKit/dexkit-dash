import React, {useCallback, useEffect, useState} from 'react';
import GridContainer from '@crema/core/GridContainer';
import {Grid, TextField} from '@material-ui/core';
import {GeneralConfig, SocialNetworks} from '@types';
import {WizardProps} from './';
import {WizardData} from './index';
import isURL from 'validator/lib/isURL';
import {isAddress} from '@ethersproject/address';
import {capitalize} from 'utils/text';
interface GeneralFormFormProps {
  title: string;
  fields: GeneralConfig;
}

interface error {
  [key: string]: string | undefined;
}

type Props = GeneralFormFormProps & WizardProps;

// const contactsType = ['Telegram Url', 'Twitter Url', 'Facebook Url', 'Discord Url', 'Reddit Url', 'BitcoinTalk Url']

const GeneralForm: React.FC<Props> = (props) => {
  const {
    fields: startData,
    changeIssuerForm,
    validator,
    isValid: startValidation,
  } = props;
  const [errors, setErrors] = useState<error>();
  const [fields, setFields] = useState<GeneralConfig>(startData);
  const [valid, setValid] = useState<boolean>(startValidation);

  const changeFields = (
    $event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: string,
  ) => {
    setFields({
      ...fields,
      [key]: $event.target.value,
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
    (key: keyof GeneralConfig) => {
      const {title, icon, domain, feeRecipient, feePercentage} = fields;
      if (errors != null) {
        switch (key) {
          case 'title': {
            errors.title =
              (title ?? '').length > 3 ? undefined : 'Title invalid!';
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
              feePercentage != null &&
              (perc < 0 || perc > 100 || isNaN(perc) || !isFinite(perc))
                ? 'Fee Percentage number is invalid'
                : undefined;
            break;
          }
          case 'feeRecipient': {
            errors.feeRecipient = isAddress(feeRecipient ?? '')
              ? undefined
              : 'Invalid Fee Address';
            break;
          }
        }
        const _valid = Object.keys(errors)
          .filter((k) => !(`${k}` in (fields?.social ?? {})))
          .reduce((pre, cur): boolean => {
            type k = keyof typeof fields;
            const fieldValid =
              fields[cur as k] != null &&
              (fields[cur as k]?.toString()?.length ?? 0) > 0;
            return pre && errors[cur] == null && fieldValid;
          }, true);
        setValid(_valid);
        setErrors({
          ...errors,
        });
      }
    },
    [fields, errors],
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
    const {social} = fields;
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
    Object.keys(_errors).forEach((k) => {
      if (k !== 'social') {
        type key = keyof GeneralConfig;
        validatorToOtherFields(k as key);
      }
    });
    setErrors(_errors);
  }, []);

  useEffect(() => {
    changeIssuerForm(WizardData.GENERAL, fields);
  }, [fields, changeIssuerForm]);

  useEffect(() => {
    validator(valid);
  }, [valid, validator]);

  return (
    <GridContainer>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          type='text'
          key='marketplace-title'
          id='marketplace-title'
          fullWidth
          label='Title'
          variant='outlined'
          value={fields.title}
          helperText={!valid ? errors?.title : undefined}
          error={errors?.title != null}
          onBlur={($e) => {
            validatorToOtherFields('title');
          }}
          onChange={($e) => {
            changeFields($e, 'title');
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          type='text'
          key='marketplace-icon'
          id='marketplace-icon'
          fullWidth
          label='Icon'
          variant='outlined'
          value={fields.icon}
          helperText={!valid ? errors?.icon : undefined}
          error={errors?.icon != null}
          onBlur={($e) => {
            validatorToOtherFields('icon');
          }}
          onChange={($e) => {
            changeFields($e, 'icon');
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          type='text'
          key='marketplace-domain'
          id='marketplace-domain'
          fullWidth
          label='Domain'
          variant='outlined'
          value={fields.domain}
          helperText={!valid ? errors?.domain : undefined}
          error={errors?.domain != null}
          onBlur={($e) => {
            validatorToOtherFields('domain');
          }}
          onChange={($e) => {
            changeFields($e, 'domain');
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          type='text'
          key='marketplace-feeRecipient'
          id='marketplace-feeRecipient'
          fullWidth
          label='Fee Address'
          variant='outlined'
          value={fields.feeRecipient}
          helperText={!valid ? errors?.feeRecipient : undefined}
          error={errors?.feeRecipient != null}
          onBlur={($e) => {
            validatorToOtherFields('feeRecipient');
          }}
          onChange={($e) => {
            changeFields($e, 'feeRecipient');
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} sm={6}>
        <TextField
          type='text'
          key='marketplace-feePercentage'
          id='marketplace-feePercentage'
          fullWidth
          label='Fee Percentage'
          variant='outlined'
          value={fields.feePercentage}
          helperText={!valid ? errors?.feePercentage : undefined}
          error={errors?.feePercentage != null}
          onBlur={($e) => {
            validatorToOtherFields('feePercentage');
          }}
          onChange={($e) => {
            changeFields($e, 'feePercentage');
          }}
        />
      </Grid>

      {Object.keys(fields?.social ?? {}).map((key: string, i) => (
        <Grid item xs={12} md={6} sm={6}>
          <TextField
            type='url'
            error={errors != null ? errors[key] != null : false}
            helperText={errors != null ? errors[key] : undefined}
            id={`marketplace-${key.replace('_', '-').toLowerCase()}`}
            key={`marketplace-${key.replace('_', '-').toLowerCase()}`}
            fullWidth
            label={`${key.replace('_', ' ').toLowerCase()}`}
            variant='outlined'
            value={fields?.social ? Object.values(fields?.social)[i] : ''}
            onBlur={($e) => {
              type k = keyof typeof fields.social;
              socialvalidator(key as k);
            }}
            onChange={($e) => {
              changeSocialFields($e, key);
            }}
          />
        </Grid>
      ))}
    </GridContainer>
  );
};

export default GeneralForm;
