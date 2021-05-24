import React, { useCallback, useEffect, useMemo, useState } from 'react';
import GridContainer from '@crema/core/GridContainer';
import { AggregatorGeneralConfig } from '@types';
import { WizardData, WizardProps } from '..';
import { ItemComponent } from './generalItem';

interface error {
  [key: string]: string | undefined;
}

interface GeneralFormProps extends Omit<WizardProps, 'config'>{
  title: string
  data: AggregatorGeneralConfig;
}
type Props = GeneralFormProps;

// type t =  AllValues<Omit<AggregatorGeneralConfig, 'hide_powered_by_dexkit'>>;
type k = keyof AggregatorGeneralConfig;

const GeneralForm: React.FC<Props> = (props) => {
  const { data: startData, changeIssuerForm, validator, isValid: startValidation } = props;
  const [errors, setErrors] = useState<error>();
  const [fields, setFields] = useState({ ...startData } as AggregatorGeneralConfig);
  const [valid, setValid] = useState<Map<string, boolean>>(new Map<string, boolean>());

  const changeFields = useCallback((
    $event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: string,
    type: 'string' | 'number' | 'boolean'
  ) => {
    console.log('changeFields', {key, type});
    setFields({
      ...fields,
      [key]: type === 'string' ? $event.target.value :
        (type === 'number' ? Number($event.target.value) : Boolean($event.target.value))
    });
  }, [fields, setFields]);

  const keys = useMemo(() => {
    return Object.keys(fields) as k[];
  }, [fields]);

  useEffect(() => {
    const map = new Map<string, boolean>();
    const _errors: error = Object.keys(fields ?? {}).reduce((pre, cur) => {
      map.set(cur, startValidation);
      return {
        ...pre,
        [cur]: errors != null ? errors[(cur as k)] : undefined,
      } as error;
    }, {} as error);
    setErrors(_errors);
    setValid(map);
    console.log('GeneralForm loaded!', valid);
  }, []);

  useEffect(() => {
    console.log('fields', fields);
    console.log('fields are validate?', valid);
    changeIssuerForm(WizardData.GENERAL, fields);
  }, [fields, changeIssuerForm]);

  useEffect(() => {
    console.log('valid', valid);
    const _isValid = [...valid.values()].reduce((acu, cur) => acu && cur, true);
    console.log('generalForm is valid?', _isValid);
    validator(_isValid);
  }, [valid, validator]);

  return (
    <GridContainer>
      {
        keys.map(key => (
          <ItemComponent 
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
          key={key}/>
        ))
      }
    </GridContainer>
  );
}

export default GeneralForm;