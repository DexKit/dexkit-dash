import {withStyles, ButtonBase} from '@material-ui/core';

export const AppBarButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
  },
}))(ButtonBase);

export default AppBarButton;
