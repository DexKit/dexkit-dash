import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core';
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
    },
}));

interface ColorInputProps {
	value?: Color;
	onChange?: ColorChangeHandler
}

export const ColorInput: React.FC<ColorInputProps> = (props) => {
	const { value, onChange } = props;
	const classes = useStyles();
	const initColor: Color = value ?? '#FFFFFF';
	const [color, setColor] = React.useState<Color>(initColor);
	return (
		<div className={classes.root}>
			<ChromePicker 
			color={color}
			onChange={
				(_color, $e) => {
					setColor(_color.hex);
					if(onChange != null){
						onChange(_color, $e);
					}
				}
			} />
		</div>
	);
};