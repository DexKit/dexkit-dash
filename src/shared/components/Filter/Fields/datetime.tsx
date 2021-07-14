import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Box } from '@material-ui/core';
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
            width: 220,
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

const DateAndTimePickerFilterField = (props: Props) => {
    const { label, value, enable, onChange } = props;
    const classes = useStyles();

    return (
      enable ? 
       <Box display={'flex'} alignItems={'center'}>
            <IconButton aria-label="delete" onClick={props.onClose} color="secondary">
                <DeleteIcon />
            </IconButton>
            <TextField
                label={label}
                type="datetime-local"
                defaultValue={value}
                onChange={(ev) => onChange(ev.target.value) }
                className={classes.textField}
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </Box> 
        : null)
  
}

export default DateAndTimePickerFilterField;