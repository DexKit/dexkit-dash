import { 
  Avatar, 
  Button, 
  // IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  // makeStyles 
} from "@material-ui/core";
import FolderIcon from '@material-ui/icons/Folder';
// import DeleteIcon from '@material-ui/icons/Delete';
import React from "react";
import { BigNumber } from "@0x/utils";
// import { Fonts } from "shared/constants/AppEnums";
// import { CremaTheme } from "types/AppContextPropsType";



// const useStyles = makeStyles((theme: CremaTheme) => ({
//   statsCard: {
//     borderRadius: theme.overrides.MuiCardLg.root.borderRadius,
//     padding: 10
//   },
//   root: {
//     height: 30,
//     width: 30,
//     borderRadius: theme.overrides.MuiCardLg.root.borderRadius,
//     backgroundColor: (props: { bgColor: string }) => props.bgColor,
//     [theme.breakpoints.up('md')]: {
//       height: 45,
//       width: 45,
//     },
//     [theme.breakpoints.up('xl')]: {
//       height: 70,
//       width: 70,
//     },
//   },
// }));

interface KitProps {
  icon: string;
  name: string;
  button: {
    color: "inherit" | "primary" | "secondary" | "default" | undefined;
    title: string;
    action: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, globalThis.MouseEvent>) => void | undefined;
  };
  value: number | string | BigNumber;
  color?: string;
}

export const Kit: React.FC<KitProps> = (props) => {
  const { name, value, button } = props;
  // const color = props.color ?? '#989898';
  // const classes = useStyles({ bgColor: color });
  return (
    <ListItem>
      
      <ListItemAvatar>
        <Avatar>
          <FolderIcon />
        </Avatar>
      </ListItemAvatar>

      <ListItemText primary={name} secondary={`${value} KIT`} />
      
      <ListItemSecondaryAction>
        <Button variant="outlined" color={button.color} onClick={($e) => button.action($e)}>
          {button.title}
        </Button>
      </ListItemSecondaryAction>

    </ListItem>
  );
}
