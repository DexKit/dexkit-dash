import React from 'react';
import GridContainer  from '@crema/core/GridContainer';
import { Grid, TextField }  from '@material-ui/core';

interface Props {
	title: string
}

const contactsType = ['Telegram Url', 'Twitter Url', 'Facebook Url', 'Discord Url', 'Reddit Url', 'BitcoinTalk Url']
const GeneralForm: React.FC<Props> = (props) => {
	
	return (
	<GridContainer>
		{
			contactsType.map( contact => (
				<Grid item xs={12} md={6} sm={6}>
					<TextField
					type="url"
					key={`aggregator-${contact.replace(' ', '-').toLowerCase()}`} 
					id={`aggregator-${contact.replace(' ', '-').toLowerCase()}`} 
					fullWidth 
					label={contact}
					variant="outlined" 
					/>
				</Grid>
			))
		}
		
	</GridContainer>
	);
}

export default GeneralForm;