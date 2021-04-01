import React, { useEffect, useState } from 'react';
import GridContainer  from '@crema/core/GridContainer';
import { Grid, TextField }  from '@material-ui/core';
import { GeneralConfig } from '@types';
import { WizardProps } from './';
import { WizardData } from './index';

interface GeneralFormFormProps {
	title: string
	fields: GeneralConfig
}

type Props = GeneralFormFormProps & WizardProps;

// const contactsType = ['Telegram Url', 'Twitter Url', 'Facebook Url', 'Discord Url', 'Reddit Url', 'BitcoinTalk Url']

const GeneralForm: React.FC<Props> = (props) => {
	const { fields:startData, changeIssuerForm } = props;
	const [fields, setFields] = useState<GeneralConfig>(startData);
	
	useEffect(() => {
		changeIssuerForm(WizardData.GENERAL, fields);
	}, [fields]);

	const changeFields = ($event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
		setFields({
			...fields,
			[key]: $event.target.value
		});
	}

	const changeSocialFields = ($event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {		
		const { social } = fields;

		setFields({
			...fields,
			social: {
				...social,
				[key]: $event.target.value
			}
		});
	}

	return (
	<GridContainer>
		<Grid item xs={12} md={6} sm={6}>
			<TextField
				type="text"
				key='marketplace-title'
				id='marketplace-title' 
				fullWidth 
				label='Title'
				variant="outlined"
				value={fields.title}
				onChange={
					($e) => {
						changeFields($e, 'title');
					}
				}
				/>
		</Grid>
		<Grid item xs={12} md={6} sm={6}>
			<TextField
				type="text"
				key='marketplace-icon' 
				id='marketplace-icon' 
				fullWidth 
				label='Icon'
				variant="outlined"
				value={fields.icon}
				onChange={
					($e) => {
						changeFields($e, 'icon');
					}
				}
				/>
		</Grid>
		<Grid item xs={12} md={6} sm={6}>
			<TextField
				type="text"
				key='marketplace-domain' 
				id='marketplace-domain' 
				fullWidth 
				label='Domain'
				variant="outlined" 
				value={fields.domain}
				onChange={
					($e) => {
						changeFields($e, 'domain');
					}
				}
				/>
		</Grid>
		<Grid item xs={12} md={6} sm={6}>
			<TextField
				type="text"
				key='marketplace-feeRecipient' 
				id='marketplace-feeRecipient' 
				fullWidth 
				label='Fee Address'
				variant="outlined" 
				value={fields.feeRecipient}
				onChange={
					($e) => {
						changeFields($e, 'feeRecipient');
					}
				}
				/>
		</Grid>
		<Grid item xs={12} md={6} sm={6}>
			<TextField
				type="text"
				key='marketplace-feePercentage' 
				id='marketplace-feePercentage' 
				fullWidth 
				label='Fee Percentage'
				variant="outlined"
				value={fields.feePercentage}
				onChange={
					($e) => {
						changeFields($e, 'feePercentage');
					}
				}
				/>
		</Grid>

		{			
			Object.keys(fields?.social ?? {}).map((key: string, i) => (
				<Grid item xs={12} md={6} sm={6}>
					<TextField
					type="url"
					key={`marketplace-${key.replace('_', '-').toLowerCase()}`} 
					id={`marketplace-${key.replace('_', '-').toLowerCase()}`} 
					fullWidth 
					label={`${key.replace('_', ' ').toLowerCase()}`}
					variant="outlined"
					value={ fields?.social ? Object.values(fields?.social)[i] : '' }
					onChange={
						($e) => {
							changeSocialFields($e, key);
						}
					}
					/>
				</Grid>
			))
		}
		
	</GridContainer>
	);
}

export default GeneralForm;