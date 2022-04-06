import React, {useContext} from 'react';

import AppContext from '../../utility/AppContext';
import Layouts from './Layouts';

import useStyles from '../../../shared/jss/common/common.style';
import AppContextPropsType from '../../../types/AppContextPropsType';
import {useGlobalState, GlobalStateContext} from 'hooks/useGlobalState';
import {TransactionManager} from 'shared/components/TransationManager';

interface CremaLayoutProps {}

const CremaLayout: React.FC<CremaLayoutProps> = () => {
  useStyles();
  const {navStyle} = useContext<AppContextPropsType>(AppContext);
  const AppLayout = Layouts[navStyle];

  const globalState = useGlobalState();

  return (
    <>
      <GlobalStateContext.Provider value={globalState}>
        <TransactionManager />
        <AppLayout />
      </GlobalStateContext.Provider>
    </>
  );
};

export default React.memo(CremaLayout);
