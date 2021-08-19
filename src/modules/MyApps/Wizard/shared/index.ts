export interface error {
  [key: string]: string | undefined;
}

export interface WizardProps<T, K> {
  config: T;
  //method to change form values
  changeIssuerForm: (key: K | 'editable', value: any) => void;
  validator: (isValid: boolean) => void;
  isValid: boolean;
  editable?: boolean;
}

export type HelpText<T> = {
  readonly [Property in keyof T]: string[];
};

export function getHelpText<T>(
  helpText: HelpText<T>,
  key: string,
  index = 0,
): string {
  if (helpText == null || index < 0 || key == null || key.length === 0) {
    return '';
  }
  type K = keyof typeof helpText;
  if (
    !((key as K) in helpText) ||
    helpText[key as K] == null ||
    index >= helpText[key as K].length
  ) {
    return '';
  }
  return helpText[key as K][index];
}

export function fillError(obj: any, fill: any): error {
  if (obj == null) {
    return {};
  }
  const e: error = Object.keys(obj).reduce((obj, key) => {
    return {
      ...obj,
      [key]: fill,
    };
  }, {} as error);
  return e;
}
