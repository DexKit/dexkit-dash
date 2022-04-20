import {withStyles, IconButton} from '@material-ui/core';

export const RoundedIconButton = withStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.paper,
    '& svg path': {
      stroke: theme.palette.text.primary,
    },
    borderRadius: theme.shape.borderRadius,
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
  },
}))(IconButton);

export default RoundedIconButton;
