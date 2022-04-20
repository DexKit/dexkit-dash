import {IconButton, withStyles} from '@material-ui/core';

export const SquaredIconButton = withStyles((theme) => ({
  root: {
    border: `1px solid ${theme.palette.text.primary} `,
    borderRadius: theme.shape.borderRadius,
    '& svg path': {
      stroke: theme.palette.text.primary,
    },
  },
}))(IconButton);

export default SquaredIconButton;
