import React, { useCallback, useEffect, useState} from 'react';
import GridContainer from '@crema/core/GridContainer';
import {
	Grid,
	TextField,
	IconButton,
	Divider,
	withStyles
} from '@material-ui/core';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { TokenMetaData } from '@types';
import { ZERO_ADDRESS } from 'shared/constants/Blockchain';
import { WizardProps } from './';

const CustomGrid = withStyles((theme) => ({
	root: {
		padding: `${theme.spacing(0)} !important;`,
		margin: theme.spacing(1,0)
	}
}))(Grid);



interface TokenComponentProps {
	index: number;
	data: TokenMetaData;
	onChange: ($event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		token: TokenMetaData,
		index: number
	) => void
}
const TokenComponent: React.FC<TokenComponentProps> = (props) => {
	const { index, data, onChange } = props;
	const [name, setName] = useState(data.name);
	const [symbol, setSymbol] = useState(data.symbol);
	const [decimals, setDecimals] = useState(data.decimals);
	const [address, setAddress] = useState(data.address);

	return (
		<>
			<Grid item xs={12} md={6} sm={6}>
				<TextField
					key={`token(${index}).name`}
					id={`token(${index}).name`}
					value={name}
					onChange={
						($e) => {
							setName($e.target.value);
							onChange($e, {...data, name: $e.target.value}, index);
						}
					}
					fullWidth label={`name`}
					variant="outlined"
				/>
			</Grid>
			<Grid item xs={12} md={6} sm={6}>
				<TextField
					key={`token(${index}).symbol`}
					id={`token(${index}).symbol`}
					value={symbol}
					onChange={
						($e) => {
							data.symbol = $e.target.value;
							setSymbol(data.symbol);
							onChange($e, data, index);
						}
					}
					fullWidth
					label="symbol"
					variant="outlined"
				/>
			</Grid>
			<Grid item xs={12} md={6} sm={6}>
				<TextField
					key={`token(${index}).decimals`}
					id={`token(${index}).decimals`}
					value={decimals}
					onChange={
						($e) => {
							const value = $e.target.value != null && $e.target.value != '' ? 
							$e.target.value : '18';

							data.decimals = parseInt(value);

							setDecimals(data.decimals);
							onChange($e, data, index);
						}
					}
					fullWidth
					label="decimals"
					variant="outlined"
				/>
			</Grid>
			<Grid item xs={12} md={6} sm={6}>
				<TextField
					key={`token(${index}).address`}
					id={`token(${index}).address`}
					value={address}
					onChange={
						($e) => {
							data.address = $e.target.value;
							setAddress(data.address);
							onChange($e, data, index);
						}
					}
					fullWidth
					label="address"
					variant="outlined"
				/>
			</Grid>
		</>
	)
}



interface TokensFormProps {
	title: string
	tokens?: TokenMetaData[]
}

type Props = TokensFormProps & WizardProps;
const TokensForm: React.FC<Props> = (props) => {
	const { changeIssuerForm } = props;
	const [tokens, setTokens] = useState(props.tokens ?? []);
	useEffect(() => {
		if(tokens == null || tokens?.length === 0){
			addToken();
		}
	}, []);

	const onChange = useCallback(
		($event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
			token: TokenMetaData,
			index: number
		) => {
			if (index >= 0 && tokens != null && index < tokens.length) {
				tokens[index] = token;
				changeIssuerForm('tokens', tokens);
			}
		}, [tokens, changeIssuerForm]);

	const addToken = useCallback((index?: number) => {
		const newItem = {
			name: '',
			symbol: '',
			decimals: 0,
			address: ZERO_ADDRESS,
			addresses: {}
		};
		
		if(index != null && index > 0 && index < (tokens?.length ?? 0)){
			tokens.splice(index, 0, newItem);
			setTokens([...tokens]);
			return;
		}
		setTokens([...(tokens ?? []), newItem]);
	}, [tokens, setTokens]);
	
	useEffect(() => {
		changeIssuerForm('tokens', [...tokens]);
	}, [tokens, changeIssuerForm])

	const remToken = useCallback((index: number) => {
		if(index >=0 && index < tokens?.length){
			tokens.splice(index, 1);
			const _tokens = [...tokens];
			setTokens(_tokens);
		}
	}, [tokens, setTokens]);

	return (
		<GridContainer>

			{
				tokens != null ? tokens.map((token: TokenMetaData, i: number) => (
					<>
						{
							i > 0 && (
								<CustomGrid item xs={12} md={12} sm={12}>
									<Divider></Divider>
								</CustomGrid>
							)
						}
						<Grid item xs={12} md={12} sm={12} style={{ textAlign: 'right' }}>
							<IconButton aria-label="add" onClick={() => addToken(i)}>
								<AddCircleOutlineOutlinedIcon fontSize="small" />
							</IconButton>
							{
								i > 0 && (
									<IconButton aria-label="delete">
										<DeleteOutlinedIcon onClick={() => remToken(i)} fontSize="small" />
									</IconButton>
								)
							}
						</Grid>
						<TokenComponent
							key={Math.round(Math.random()*1000 + i)}
							index={i}
							data={token}
							onChange={onChange}
						/>
					</>
				)) : null
			}
		</GridContainer>
	);
}

export default TokensForm;