import React, {useContext} from 'react';


import AppContext from '../../utility/AppContext';
import Layouts from './Layouts';

import useStyles from '../../../shared/jss/common/common.style';
import AppContextPropsType from '../../../types/AppContextPropsType';


interface CremaLayoutProps {}

const CremaLayout: React.FC<CremaLayoutProps> = () => {
  useStyles();
  const {navStyle} = useContext<AppContextPropsType>(AppContext);
  const AppLayout = Layouts[navStyle];


  return (
    <>
        <AppLayout />
     
    </>
  );
};

export default React.memo(CremaLayout);
