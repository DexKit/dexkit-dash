import {withStyles, IconButton} from '@material-ui/core';

export const RoundedIconButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
}))(IconButton);

export default RoundedIconButton;
