import React, { useState, useEffect, useCallback } from 'react';
import GridContainer from '@crema/core/GridContainer';
import { Grid, TextField } from '@material-ui/core';
import { WizardData, WizardProps } from '.';
import { GeneralConfig, SocialNetworks } from '@types';
import { capitalize } from 'utils';
import { urlValidator } from 'utils/text';

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
  const { fields: startData, changeIssuerForm, validator, isValid: startValidation } = props;
  const [errors, setErrors] = useState<error>();
  const [fields, setFields] = useState<GeneralConfig>(startData);
  const [valid, setValid] = useState<boolean>(startValidation);

  const changeFields = ($event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    const { social } = fields;

    setFields({
      ...fields,
      social: {
        ...social,
        [key]: $event.target.value
      }
    });
  }
  const socialvalidator = useCallback((key: keyof SocialNetworks) => {
    const { social } = fields;
    if (social != null && errors) {
      type k = keyof typeof social;
      const socialUrl: string | undefined = social != null ? social[(key as k)] : undefined;
      const errorMsg = socialUrl != null && socialUrl.length > 0 ?
        (!urlValidator(socialUrl) ? `${capitalize(key, '_', ' ')} is invalid!` : undefined) : undefined;
      errors[(key as k)] = errorMsg;
      // const _valid = errors[(key as k)] != null ? false : valid;
      const _valid = errors[(key as k)] == null ;
      setValid(_valid);
      setErrors({
        ...errors
      });
    }
  }, [fields, errors]);
  useEffect(() => {
    const { social } = fields;
    const _errors: error = Object.keys(social ?? {}).reduce((pre, cur) => {
      type k = keyof typeof social;
      return {
        ...pre,
        [cur]: errors != null ? errors[(cur as k)] : undefined,
      } as error;
    }, {} as error);
    setErrors(_errors);
  }, []);

  useEffect(() => {
    changeIssuerForm(WizardData.CONTACT, fields);
  }, [fields, changeIssuerForm]);

  useEffect(() => {
    validator(valid);
  }, [valid, validator]);
  return (
    <GridContainer>
      {
        Object.keys(fields?.social ?? {}).map((key: string, i) => (
          <Grid item xs={12} md={6} sm={6}>
            <TextField
              type="url"
              error={errors != null ? errors[key] != null : false}
              helperText={errors != null ? errors[key] : undefined}
              key={`aggregator-${key.replace(' ', '-').toLowerCase()}`}
              id={`aggregator-${key.replace(' ', '-').toLowerCase()}`}
              fullWidth
              label={`${key.replace('_', ' ').toLowerCase()}`}
              variant="outlined"
              value={fields?.social ? Object.values(fields?.social)[i] : ''}
              onBlur={
                ($e) => {
                  type k = keyof typeof fields.social;
                  socialvalidator((key as k))
                }
              }
              onChange={
                ($e) => {
                  changeFields($e, key);
                }
              }
            />
          </Grid>
        ))
      }

    </GridContainer>
  );
}

export default GeneralForm;