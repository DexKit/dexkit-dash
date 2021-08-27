import TokenSetup from 'modules/Wizard/components/setups/TokensSetup';
import React, {useCallback, useState} from 'react';
import MainLayout from 'shared/components/layouts/main';

interface Props {}

export default (props: Props) => {
  return (
    <MainLayout>
      <TokenSetup />
    </MainLayout>
  );
};
