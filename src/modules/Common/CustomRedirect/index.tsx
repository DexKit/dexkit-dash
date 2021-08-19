import React, {PropsWithChildren} from 'react';
import {Redirect} from 'react-router';
import {useNetwork} from 'hooks/useNetwork';

interface Props {
  to: string;
}

export const CustomRedirect: React.FC<PropsWithChildren<Props>> = (props) => {
  const {to} = props;

  const networkName = useNetwork();

  return networkName && <Redirect to={`/${networkName}/${to}`} />;
};
