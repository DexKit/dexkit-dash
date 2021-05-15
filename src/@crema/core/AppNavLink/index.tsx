import React, {ReactNode} from 'react';
import {Link} from 'react-router-dom';

interface AppNavLinkProps {
  to: string;
  children: ReactNode;

  [x: string]: any;
}
// It was giving this error
// https://material-ui.com/guides/composition/#caveat-with-refs
const AppNavLink: React.FC<AppNavLinkProps> = React.forwardRef(({to, children, ...rest}, ref) => (
  //@ts-ignore
  <Link to={to} {...rest} ref={ref}>
    <>{children}</>
  </Link>
));

export default AppNavLink;
