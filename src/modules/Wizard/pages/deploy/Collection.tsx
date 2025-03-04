import CollectionSetup from 'modules/Wizard/components/setups/CollectionSetup';
import React, {useCallback, useState} from 'react';
import MainLayout from 'shared/components/layouts/main';

interface WizardSetupProps {}

export default (props: WizardSetupProps) => {
  return (
    <MainLayout>
      <CollectionSetup />
    </MainLayout>
  );
};
