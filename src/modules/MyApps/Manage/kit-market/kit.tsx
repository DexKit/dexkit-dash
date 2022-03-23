import {
  Avatar,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import React from 'react';
import {makeStyles} from '@material-ui/core';
import {BigNumber} from '@0x/utils';
import {CremaTheme} from 'types/AppContextPropsType';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 50,
    width: 50,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: (props: {bgColor: string}) => props.bgColor,
  },
}));

interface KitProps {
  icon: string;
  name: string;
  button: {
    color: 'inherit' | 'primary' | 'secondary' | 'default' | undefined;
    title: string;
    action: (
      event: React.MouseEvent<
        HTMLAnchorElement | HTMLButtonElement,
        globalThis.MouseEvent
      >,
    ) => void | undefined;
  };
  value: number | string | BigNumber;
  color?: string;
  bgColor: string;
}

export const Kit: React.FC<KitProps> = (props) => {
  const {name, button, bgColor, icon} = props;
  const classes = useStyles({bgColor});
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar className={classes.root}>
          <img alt='' src={icon} width='35px' height='35px' />
        </Avatar>
      </ListItemAvatar>

      <ListItemText primary={name} secondary={`FREE`} />

      <ListItemSecondaryAction>
        <Button
          variant='outlined'
          color={button.color}
          onClick={($e) => button.action($e)}>
          {button.title}
        </Button>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
