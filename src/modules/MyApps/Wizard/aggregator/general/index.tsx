import React, {useCallback, useEffect, useMemo, useState} from 'react';
import GridContainer from '@crema/core/GridContainer';
import {ConfigFileAggregator, GeneralConfigAggregator} from 'types/myApps';
import {WizardData} from '..';
import {WizardProps} from '../../shared';
import {ItemComponent} from './generalItem';
import {capitalize} from 'utils/text';
import {CustomLabel} from 'shared/components/Wizard/Label';
import {error} from '../../shared';
import {HELP_TEXT} from '../helpText';
import {getHelpText} from '../../shared';
import {getFieldProperties} from '../fieldProperties';

interface GeneralFormProps
  extends Omit<WizardProps<ConfigFileAggregator, WizardData>, 'config'> {
  title: string;
  data: GeneralConfigAggregator;
}
type Props = GeneralFormProps;

// type t =  AllValues<Omit<AggregatorGeneralConfig, 'hide_powered_by_dexkit'>>;
type k = keyof GeneralConfigAggregator;

const GeneralForm: React.FC<Props> = (props) => {
  const {
    data: startData,
    changeIssuerForm,
    validator,
    isValid: startValidation,
    editable,
  } = props;
  const [errors, setErrors] = useState<error>();
  const [fields, setFields] = useState({
    ...startData,
  } as GeneralConfigAggregator);
  const [valid, setValid] = useState<Map<string, boolean>>(
    new Map<string, boolean>(),
  );

  const changeFields = useCallback(
    (
      $event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      key: string,
      type: 'string' | 'number' | 'boolean',
    ) => {
      if (Boolean(editable)) {
        setFields({
          ...fields,
          [key]:
            type === 'string'
              ? $event.target.value
              : type === 'number'
              ? Number($event.target.value)
              : Boolean($event.target.value),
        });
      }
    },
    [fields, setFields, editable],
  );

  const keys = useMemo(() => {
    const exclude = ['is_dark_mode', 'brand_color', 'brand_color_dark'];
    return Object.keys(fields).filter((f) =>
      exclude.every((x) => x !== f),
    ) as k[];
  }, [fields]);

  /* eslint-disable */
  useEffect(() => {
    const map = new Map<string, boolean>();
    const _errors: error = keys.reduce((pre, cur) => {
      map.set(cur, startValidation);
      return {
        ...pre,
        [cur]: errors != null ? errors[cur as k] : undefined,
      } as error;
    }, {} as error);
    setErrors(_errors);
    setValid(map);
  }, []);

  useEffect(() => {
    console.log(fields);
    console.log(editable);
    if (Boolean(editable)) {
      console.log('called');
      changeIssuerForm(WizardData.GENERAL, fields);
    }
  }, [fields, changeIssuerForm, editable]);

  useEffect(() => {
    const _isValid = [...valid.values()].reduce((acu, cur) => acu && cur, true);
    validator(_isValid);
  }, [valid, validator]);
  return (
    <GridContainer>
      {keys.map((key) => {
        const helpText = getHelpText(HELP_TEXT, key, 0);
        return (
          <ItemComponent
            label={
              <CustomLabel
                required={
                  getFieldProperties(key)?.isRequired !== undefined
                    ? getFieldProperties(key)?.isRequired
                    : true
                }>
                {capitalize(key, '_')}
              </CustomLabel>
            }
            fieldName={key}
            changeField={changeFields}
            validator={(_valid: boolean) => {
              if (valid.get(key) !== _valid) {
                valid.set(key, _valid);
                setValid(new Map<string, boolean>(valid.entries()));
              }
            }}
            value={fields[key]}
            isValid={valid.get(key) ?? false}
            key={key}
            helpText={helpText}
          />
        );
      })}
    </GridContainer>
  );
};

export default GeneralForm;
