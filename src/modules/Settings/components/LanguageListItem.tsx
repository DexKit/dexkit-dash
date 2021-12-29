import React, {useCallback} from 'react';

import * as types from '../types';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FlagIcon from 'shared/components/FlagIcon';

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
        <FlagIcon id={language.icon} />
      </ListItemIcon>
      <ListItemText primary={language.name} />
    </ListItem>
  );
};

export default LanguageListItem;
