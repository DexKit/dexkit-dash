import {IconButton, withStyles} from '@material-ui/core';

export const SquaredIconButton = withStyles((theme) => ({
  root: {
    border: `1px solid ${theme.palette.divider} `,
    borderRadius: theme.shape.borderRadius,
    '& svg path': {
      stroke: theme.palette.text.primary,
    },
    '&:hover': {
      borderColor: theme.palette.text.primary,
    },
  },
}))(IconButton);

export default SquaredIconButton;
