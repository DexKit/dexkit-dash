import React, {useState} from 'react';
import Popover from '@material-ui/core/Popover';
import {List, ListItem} from '@material-ui/core';

export interface NotificationItemOptionsData {
  option: string;
  action: (item: string | number | symbol) => void;
}

interface NotificationItemOptionsProps {
  options: NotificationItemOptionsData[];
  onClose?:
    | ((event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void)
    | undefined;
  anchorEl?: Element | ((element: Element) => Element);
  open?: boolean;
}

export const NotificationItemOptions: React.FC<NotificationItemOptionsProps> = (
  props,
) => {
  const {options, anchorEl, open, onClose} = props;
  const [show, setShow] = useState(Boolean(open));
  return (
    <Popover
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      anchorEl={anchorEl}
      open={show}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      onClose={($e) => {
        if (onClose) {
          onClose($e, 'backdropClick');
        }
        setShow(false);
      }}>
      <List>
        {options?.map(({option, action}, i) => (
          <ListItem
            key={`notificationOption[${i}]`}
            button
            onClick={($e) => {
              $e.preventDefault();
              action($e.currentTarget.id);
              setShow(false);
            }}>
            {option}
          </ListItem>
        ))}
      </List>
    </Popover>
  );
};
