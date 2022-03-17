import {IconButton, withStyles} from '@material-ui/core';

export const SquaredIconButton = withStyles((theme) => ({
  root: {
    border: `1px ${
      true ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)'
    } solid !important`,
    borderRadius: theme.shape.borderRadius,
  },
}))(IconButton);

export default SquaredIconButton;
