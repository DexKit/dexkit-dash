import React, { useCallback, useEffect, useMemo, useState } from 'react';
import GridContainer from '@crema/core/GridContainer';
import { GeneralConfigAggregator } from 'types/myApps';
import { WizardData, WizardProps } from '..';
import { ItemComponent } from './generalItem';
import { capitalize } from 'utils/text';
import { CustomLabel } from 'shared/components/Wizard/Label';
import { error } from '../../shared';

const helpText = new Map<keyof GeneralConfigAggregator, string>();
helpText.set("name", 'enter a name that has not yet been used in other projects as the title of the current project.');
helpText.set('logo', '');
helpText.set('logo_dark', '');
helpText.set('domain', '');
helpText.set('feeRecipient', '');
helpText.set('affiliateAddress', '');
helpText.set('brand_color', '');
helpText.set('brand_color_dark', '');
helpText.set('bsc_as_default', '');
helpText.set('buyTokenPercentage', '');
helpText.set('default_token_address', '');
helpText.set('default_token_address_bsc', '');
helpText.set('default_token_list', '');
helpText.set('fee_waive_for_default_token', '');
helpText.set('hide_powered_by_dexkit', '');
helpText.set('is_dark_mode', '');
helpText.set('support_bsc', '');

interface GeneralFormProps extends Omit<WizardProps, 'config'>{
  title: string
  data: GeneralConfigAggregator;
}
type Props = GeneralFormProps;

// type t =  AllValues<Omit<AggregatorGeneralConfig, 'hide_powered_by_dexkit'>>;
type k = keyof GeneralConfigAggregator;

const GeneralForm: React.FC<Props> = (props) => {
  const { data: startData, changeIssuerForm, validator, isValid: startValidation, editable } = props;
  const [errors, setErrors] = useState<error>();
  const [fields, setFields] = useState({ ...startData } as GeneralConfigAggregator);
  const [valid, setValid] = useState<Map<string, boolean>>(new Map<string, boolean>());

  const changeFields = useCallback((
    $event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: string,
    type: 'string' | 'number' | 'boolean'
  ) => {
    if(Boolean(editable)){
      setFields({
        ...fields,
        [key]: type === 'string' ? $event.target.value :
          (type === 'number' ? Number($event.target.value) : Boolean($event.target.value))
      });
    }
  }, [fields, setFields, editable]);

  const keys = useMemo(() => {
    const exclude = ['is_dark_mode', 'brand_color', 'brand_color_dark'];
    return Object.keys(fields)
    .filter( f => exclude.every( x => x !== f)) as k[];
  }, [fields]);

  useEffect(() => {
    const map = new Map<string, boolean>();
    const _errors: error = keys.reduce((pre, cur) => {
      map.set(cur, startValidation);
      return {
        ...pre,
        [cur]: errors != null ? errors[(cur as k)] : undefined,
      } as error;
    }, {} as error);
    setErrors(_errors);
    setValid(map);
  }, []);

  useEffect(() => {
    if(Boolean(editable)){
      changeIssuerForm(WizardData.GENERAL, fields);
    }
  }, [fields, changeIssuerForm, editable]);

  useEffect(() => {
    const _isValid = [...valid.values()].reduce((acu, cur) => acu && cur, true);
    validator(_isValid);
  }, [valid, validator]);

  return (
    <GridContainer>
      {
        keys.map(key => (
          <ItemComponent
            label={<CustomLabel required={true}>{capitalize(key,'_')}</CustomLabel>} 
            fieldName={key} 
            changeField={changeFields} 
            validator={(_valid: boolean) => {
              if(valid.get(key) !== _valid){
                valid.set(key, _valid);
                setValid(new Map<string, boolean>(valid.entries()))
              }
            }} 
            value={fields[key]} 
            isValid={valid.get(key) ?? false}
            key={key}
            helpText={helpText.get(key) ?? ''}
          />
        ))
      }
    </GridContainer>
  );
}

export default GeneralForm;