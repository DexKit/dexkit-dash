import React, {useCallback} from 'react';

import * as types from '../types';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

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
      <ListItemText primary={language.name} />
    </ListItem>
  );
};

export default LanguageListItem;
