import React, {useCallback} from 'react';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Radio,
} from '@material-ui/core';

interface WizardListItemProps {
  slug: string;
  title: string;
  description: string;
  selected: boolean;
  onClick: (slug: string) => void;
}

export const WizardListItem = (props: WizardListItemProps) => {
  const {slug, title, selected, description, onClick} = props;

  const handleClick = useCallback(() => {
    onClick(slug);
  }, [slug, onClick]);
  return (
    <ListItem onClick={handleClick} button>
      <ListItemText
        primary={title}
        secondary={description}
        secondaryTypographyProps={{color: 'textSecondary'}}
      />
      <ListItemSecondaryAction>
        <Radio checked={selected} onClick={handleClick} />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default WizardListItem;
