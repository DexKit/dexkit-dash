import React, {PropsWithChildren} from 'react';

interface CustomLabelProps {
  text?: string;
  required?: boolean;
}

type Props = PropsWithChildren<CustomLabelProps>;
export function CustomLabel({text, required, children}: Props) {
  return required != null && required ? (
    <label>
      {text ?? children}
      <span style={{color: 'red'}}>*</span>
    </label>
  ) : (
    <label>{text ?? children}</label>
  );
}
