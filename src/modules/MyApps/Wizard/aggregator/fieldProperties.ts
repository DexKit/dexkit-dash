import {GeneralConfigAggregator} from 'types/myApps';

type Properties = {
  isRequired: boolean;
  min?: number;
  max?: number;
  step?: number;
};

export const Field_Properties: {[key: string]: Properties} = {
  logo: {
    isRequired: false,
  },
  logo_dark: {
    isRequired: false,
  },
  default_token_address: {
    isRequired: false,
  },
  default_token_address_matic: {
    isRequired: false,
  },
  default_token_address_bsc: {
    isRequired: false,
  },
  default_token_address_avax: {
    isRequired: false,
  },
  buyTokenPercentage: {
    isRequired: true,
    min: 0.0,
    max: 5,
    step: 0.01,
  },
  default_slippage: {
    isRequired: true,
    min: 0.1,
    max: 50,
    step: 0.1,
  },
};

export const getFieldProperties = (
  fieldName: keyof GeneralConfigAggregator,
) => {
  const keys = Object.keys(Field_Properties);

  if (keys.includes(fieldName)) {
    return Field_Properties[fieldName as any] as Properties;
  }
};
