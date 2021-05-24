import React, { useState } from 'react';
import { 
	Grid, 
	Typography 
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import { ColorInput } from 'shared/components/ColorInput';

const Accordion = withStyles({
	root: {
	  border: '1px solid rgba(0, 0, 0, .125)',
	  boxShadow: 'none',
	  '&:not(:last-child)': {
		borderBottom: 0,
	  },
	  '&:before': {
		display: 'none',
	  },
	  '&$expanded': {
		margin: 'auto',
	  },
	},
	expanded: {},
  })(MuiAccordion);

  const AccordionSummary = withStyles({
	root: {
	  backgroundColor: 'rgba(0, 0, 0, .03)',
	  borderBottom: '1px solid rgba(0, 0, 0, .125)',
	  marginBottom: -1,
	  minHeight: 56,
	  '&$expanded': {
		minHeight: 56,
	  },
	},
	content: {
	  '&$expanded': {
		margin: '12px 0',
	  },
	},
	expanded: {},
  })(MuiAccordionSummary);

  export const AccordionDetails = withStyles((theme) => ({
	root: {
	  padding: theme.spacing(2),
	  display: 'flex',
	  flexDirection: 'column',
	  justifyContent: 'center'
	},
  }))(MuiAccordionDetails);

interface ComponentsThemeProps {
	label: string;
	name: string;
	themeName: string;
	className: string;
}
const ComponentTheme: React.FC<ComponentsThemeProps> = (props) => {
	const { name, label, className } = props;
	const [color, setColor] = useState('#fff');
	const [expanded, setExpanded] = React.useState(false);
	const handleChange = (panel: React.ChangeEvent<any>, expanded: boolean) => {
		setExpanded(expanded);
	};
	return (
		<>
			<Grid item xs={12} md={6} sm={6}>
				<Accordion square expanded={expanded} onChange={handleChange}>
					<AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
						<Typography>{label}</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<ColorInput
							value={color}
							onChange={(_color, $event) => setColor(color)}
							key={`${name}.${className}`}
						/>
					</AccordionDetails>
				</Accordion>
			</Grid>
		</>
	);
};

export default ComponentTheme;