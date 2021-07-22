import Erc721Setup from 'modules/Wizard/components/setups/Erc721Setup';
import React, {useCallback, useState} from 'react';
import MainLayout from 'shared/components/layouts/main';

interface WizardSetupProps {}

export default (props: WizardSetupProps) => {
  return (
    <MainLayout>
      <Erc721Setup />
    </MainLayout>
  );
};
