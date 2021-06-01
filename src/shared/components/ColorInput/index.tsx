import React from 'react';
import { Box, createStyles, makeStyles, TextField } from '@material-ui/core';
import {
  ChromePicker,
  ColorChangeHandler,
  Color
} from 'react-color';
import { CremaTheme } from 'types/AppContextPropsType';

const useStyles = makeStyles((theme: CremaTheme) =>
  createStyles({
    root: {
      margin: 'auto',
      width: '100%'
    },
  }));

interface ColorInputProps {
  value?: Color;
  onChange?: ColorChangeHandler;
  disabled?: boolean;
}

export const ColorInput: React.FC<ColorInputProps> = (props) => {
  const { value, onChange, disabled } = props;
  const classes = useStyles();
  const initColor: Color = value ?? '#FFFFFF';
  const [color, setColor] = React.useState<Color>(initColor);
  return (
    <Box className={classes.root}>
      {
        Boolean(disabled) ? (
          <TextField
            value={value ?? '#FFFF'}
            type="color"
            fullWidth
            variant="outlined"
            disabled
          />
        ) :
        (
          <ChromePicker
            color={color}
            onChange={
              (_color, $e) => {
                if (!Boolean(disabled)) {
                  setColor(_color.hex);
                }
                if (onChange != null && !Boolean(disabled)) {
                  onChange(_color, $e);
                }
              }
            } 
          />
        )
      }
    </Box>
  );
};