import React, {useCallback} from 'react';

import * as types from '../types';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

// import {ReactComponent as BrazilFlagIcon} from 'assets/images/flags/brazil.svg';
// import {ReactComponent as SpainFlagIcon} from 'assets/images/flags/spain.svg';
// import {ReactComponent as KoreaFlagIcon} from 'assets/images/flags/korea.svg';
// import {ReactComponent as UnitedStatesFlagIcon} from 'assets/images/flags/united-states.svg';
// import {ReactComponent as PortugalFlagIcon} from 'assets/images/flags/portugal.svg';
import {Box} from '@material-ui/core';

interface Props {
  language: types.Language;
  onClick: (language: types.Language) => void;
  selected?: boolean;
}

export const LanguageListItem: React.FC<Props> = ({
  language,
  onClick,
  selected,
}) => {
  const handleClick = useCallback(() => {
    onClick(language);
  }, [onClick, language]);

  return (
    <ListItem selected={selected} onClick={handleClick} button>
      <ListItemIcon>
        <Box p={1} style={{fontWeight: 'bold'}}>
          {language.icon.toUpperCase()}
        </Box>
      </ListItemIcon>
      <ListItemText primary={language.name} />
    </ListItem>
  );
};

export default LanguageListItem;
