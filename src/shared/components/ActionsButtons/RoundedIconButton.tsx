import {withStyles, IconButton} from '@material-ui/core';

export const RoundedIconButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    '& svg path': {
      stroke: theme.palette.text.primary,
    },
  },
}))(IconButton);

export default RoundedIconButton;
