import React, { useState, useEffect } from 'react';
import GridContainer from '@crema/core/GridContainer';
import { Grid, TextField } from '@material-ui/core';
import { AggregatorWallet } from 'types/myApps';
import { capitalize } from 'utils';
import { WizardData, WizardProps } from '..';
import { error } from '../../shared';
import { InfoComponent } from '../../shared/Buttons/infoComponent';

const infoText = new Map<keyof AggregatorWallet, string>();
infoText.set('fortmatic', '');
infoText.set('portis', '');

const placeholders = new Map<keyof AggregatorWallet, string>();
placeholders.set('fortmatic', '');
placeholders.set('portis', '');


interface WalletFormProps {
  data: AggregatorWallet;
}
type Props = WalletFormProps & WizardProps;
const WalletsForm: React.FC<Props> = (props) => {
  const { data: startData, changeIssuerForm, validator, isValid: startValidation, editable } = props;
  const [errors, setErrors] = useState<error>();
  const [fields, setFields] = useState<AggregatorWallet>(startData);
  const [valid, setValid] = useState<boolean>(startValidation);

  const changeFields = ($event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    type k = keyof AggregatorWallet;
    fields[key as k] = $event.target.value;
    setFields({
      ...fields,
    });
  }

  useEffect(() => {
    const _errors: error = Object.keys(fields ?? {}).reduce((pre, cur) => {
      type k = keyof typeof fields;
      return {
        ...pre,
        [cur]: errors != null ? errors[(cur as k)] : undefined,
      } as error;
    }, {} as error);
    setErrors(_errors);
  }, []);

  useEffect(() => {
    if (Boolean(editable)) {
      changeIssuerForm(WizardData.WALLET, fields);
    }
  }, [fields, changeIssuerForm, editable]);

  useEffect(() => {
    validator(valid);
  }, [valid, validator]);

  return (
    <GridContainer>
      {
        Object.keys(fields ?? {}).map((key: string, i) => (
          <Grid item xs={12} md={6} sm={6} key={i}>
            <TextField
              type="url"
              error={errors != null ? errors[key] != null : false}
              helperText={errors != null ? errors[key] : undefined}
              key={`aggregator-${key.replace(' ', '-').toLowerCase()}`}
              id={`aggregator-${key.replace(' ', '-').toLowerCase()}`}
              fullWidth
              label={`${capitalize(key.replace('_', ' ').toLowerCase())}`}
              variant="outlined"
              value={fields != null ? Object.values(fields)[i] : ''}
              //   onBlur={
              //     ($e) => {
                    // if(!Boolean(editable)){
                    //   return;
                    // }
              //       type k = keyof typeof fields;
              //       socialvalidator((key as k))
              //     }
              //   }
              onChange={
                ($e) => {
                  if(Boolean(editable)){
                    changeFields($e, key);
                  }
                }
              }
              InputLabelProps={{
                shrink: true,
              }}
              placeholder={placeholders.get(key as keyof AggregatorWallet)}
              InputProps={{ endAdornment: (<InfoComponent text={infoText.get(key as keyof AggregatorWallet)} />) }}
              disabled={!Boolean(editable)}
            />
          </Grid>
        ))
      }

    </GridContainer>
  );
}

export default WalletsForm;