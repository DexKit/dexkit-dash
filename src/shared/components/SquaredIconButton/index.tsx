import {IconButton, withStyles} from '@material-ui/core';

export const SquaredIconButton = withStyles((theme) => ({
  root: {
    border: `1px ${theme.palette.divider} solid !important`,
    borderRadius: theme.shape.borderRadius,
  },
}))(IconButton);

export default SquaredIconButton;
