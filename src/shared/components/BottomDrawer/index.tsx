import {Drawer, withStyles} from '@material-ui/core';

export const BottomDrawer = withStyles((theme) => ({
  paper: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: theme.spacing(4),
  },
}))(Drawer);
