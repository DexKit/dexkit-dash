import {withStyles, InputBase} from '@material-ui/core';

export const ContainedInput = withStyles((theme) => ({
  root: {
    backgroundColor: '#252836',
    border: '1px #525C75 solid !important',
    color: '#7A8398',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    fontWeight: 500,
    fontStyle: 'normal',
  },
}))(InputBase);

export default ContainedInput;
