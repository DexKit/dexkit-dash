import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {Box, InputAdornment} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }),
);

interface Props {
  label: string;
  value: any;
  onClose: any;
  onChange: any;
  enable: boolean;
}

const AmountUsdField = (props: Props) => {
  const {label, value, enable, onChange} = props;
  const classes = useStyles();

  return enable ? (
    <Box display={'flex'} alignItems={'center'}>
      <IconButton aria-label='delete' onClick={props.onClose} color='secondary'>
        <DeleteIcon />
      </IconButton>
      <TextField
        label={label}
        defaultValue={value}
        onChange={(ev) => onChange(ev.target.value)}
        className={classes.textField}
        InputProps={{
          startAdornment: <InputAdornment position='start'>$</InputAdornment>,
        }}
      />
    </Box>
  ) : null;
};

export default AmountUsdField;
