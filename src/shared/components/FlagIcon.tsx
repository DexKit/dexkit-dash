import React from 'react';

import {ReactComponent as BrazilFlagIcon} from 'assets/images/flags/brazil.svg';
import {ReactComponent as SpainFlagIcon} from 'assets/images/flags/spain.svg';
import {ReactComponent as KoreaFlagIcon} from 'assets/images/flags/korea.svg';
import {ReactComponent as UnitedStatesFlagIcon} from 'assets/images/flags/united-states.svg';
import {ReactComponent as PortugalFlagIcon} from 'assets/images/flags/portugal.svg';

interface Props {
  id: string;
}

export const FlagIcon: React.FC<Props> = ({id}) => {
  switch (id) {
    case 'es':
      return <SpainFlagIcon width={30} height={20} />;
    case 'br':
      return <BrazilFlagIcon width={30} height={20} />;
    case 'kr':
      return <KoreaFlagIcon width={30} height={20} />;
    case 'pt':
      return <PortugalFlagIcon width={30} height={20} />;
    case 'us':
      return <UnitedStatesFlagIcon width={30} height={20} />;
    default:
      return <></>;
  }
};

export default FlagIcon;
