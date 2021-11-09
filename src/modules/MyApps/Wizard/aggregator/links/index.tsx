import React, {useState, useEffect, useCallback} from 'react';
import GridContainer from '@crema/core/GridContainer';
import {Grid, TextField} from '@material-ui/core';
import {ConfigFileAggregator, AggregatorLinks} from 'types/myApps';
import {capitalize} from 'utils';
import {urlValidator} from 'utils/text';
import {WizardData} from '..';
import {WizardProps} from '../../shared';
import {error} from '../../shared';
import {InfoComponent} from '../../shared/Buttons/infoComponent';
import {HELP_TEXT_LINKS} from '../helpText';
import {getHelpText} from '../../shared';

const placeholders = new Map<keyof AggregatorLinks, string>();
placeholders.set('about', 'https://aboutproject.com');
placeholders.set('code', 'https://github.com');
placeholders.set('docs', 'https://doc.project.com');
placeholders.set('discord', 'https://discord.com/invite/gCRAFhc');
placeholders.set('telegram', 'https://t.me/project');
placeholders.set('analytics', 'https://analytics.google.com');

interface LinksFormProps {
  data: AggregatorLinks;
}
type Props = LinksFormProps & WizardProps<ConfigFileAggregator, WizardData>;
const LinksForm: React.FC<Props> = (props) => {
  const {
    data: startData,
    changeIssuerForm,
    validator,
    isValid: startValidation,
    editable,
  } = props;
  const [errors, setErrors] = useState<error>();
  const [fields, setFields] = useState<AggregatorLinks>(startData);
  const [valid, setValid] = useState<boolean>(startValidation);

  const changeFields = (
    $event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: string,
  ) => {
    type k = keyof AggregatorLinks;
    if (Boolean(editable)) {
      fields[key as k] = $event.target.value;
      setFields({
        ...fields,
      });
    }
  };

  const socialvalidator = useCallback(
    (key: keyof AggregatorLinks) => {
      if (fields != null && errors) {
        type k = keyof typeof fields;
        const socialUrl: string | undefined = fields[key as k];
        const errorMsg =
          socialUrl != null && socialUrl.length > 0
            ? !urlValidator(socialUrl)
              ? `${capitalize(key, '_', ' ')} is invalid!`
              : undefined
            : undefined;
        errors[key as k] = errorMsg;
        // const _valid = errors[(key as k)] != null ? false : valid;
        const _valid = errors[key as k] == null;
        setValid(_valid);
        setErrors({
          ...errors,
        });
      }
    },
    [fields, errors],
  );

  /* eslint-disable */
  useEffect(() => {
    const _errors: error = Object.keys(fields ?? {}).reduce((pre, cur) => {
      type k = keyof typeof fields;
      return {
        ...pre,
        [cur]: errors != null ? errors[cur as k] : undefined,
      } as error;
    }, {} as error);
    setErrors(_errors);
  }, []);

  useEffect(() => {
    if (Boolean(editable)) {
      changeIssuerForm(WizardData.CONTACT, fields);
    }
  }, [fields, changeIssuerForm, editable]);

  useEffect(() => {
    validator(valid);
  }, [valid, validator]);
  return (
    <GridContainer>
      {Object.keys(fields ?? {}).map((key: string, i) => {
        const helpText = getHelpText(HELP_TEXT_LINKS, key, 0);
        return (
          <Grid item xs={12} md={6} sm={6} key={i}>
            <TextField
              type='url'
              error={errors != null ? errors[key] != null : false}
              helperText={errors != null ? errors[key] : undefined}
              key={`aggregator-${key.replace(' ', '-').toLowerCase()}`}
              id={`aggregator-${key.replace(' ', '-').toLowerCase()}`}
              fullWidth
              label={`${capitalize(key.replace('_', ' ').toLowerCase())}`}
              variant='outlined'
              value={fields != null ? Object.values(fields)[i] : ''}
              onBlur={($e) => {
                type k = keyof typeof fields;
                if (!Boolean(editable)) {
                  return;
                }
                socialvalidator(key as k);
              }}
              onChange={($e) => {
                changeFields($e, key);
              }}
              InputLabelProps={{
                shrink: true,
              }}
              placeholder={placeholders.get(key as keyof AggregatorLinks)}
              InputProps={{endAdornment: <InfoComponent text={helpText} />}}
              disabled={!Boolean(editable)}
            />
          </Grid>
        );
      })}
    </GridContainer>
  );
};

export default LinksForm;
