import React from 'react';

import List from '@material-ui/core/List';
import * as types from '../types';
import {LanguageListItem} from './LanguageListItem';

interface Props {
  languages: types.Language[];
  onChange: (code: types.Language) => void;
  selected: types.Language;
}

export const LanguageList: React.FC<Props> = ({
  languages,
  onChange,
  selected,
}) => {
  return (
    <List disablePadding>
      {languages.map((language: types.Language) => (
        <LanguageListItem
          key={language.languageId}
          selected={selected.locale === language.locale}
          onClick={onChange}
          language={language}
        />
      ))}
    </List>
  );
};
