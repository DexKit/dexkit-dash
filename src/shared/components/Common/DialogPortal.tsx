import {Portal} from '@material-ui/core';
import React, {useEffect, useRef} from 'react';

export interface PortalProps {
  children: React.ReactNode | React.ReactNode[] | undefined;
}

export default (props: PortalProps) => {
  const {children} = props;

  const ref = useRef<any>();

  useEffect(() => {
    ref.current = document.createElement('div');

    let body = document.getElementsByTagName('body')[0];

    body.appendChild(ref.current);

    return () => {
      document.body.removeChild(ref.current);
    };
  }, []);

  return <Portal container={ref.current}>{children}</Portal>;
};
