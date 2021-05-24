import React, { useEffect, useReducer } from 'react';
import { 
	Button, 
	Dialog, 
	DialogActions, 
	DialogContent, 
	DialogTitle, 
	useMediaQuery, 
	useTheme
} from '@material-ui/core';

export interface StepModalProps {
	children: any;
	open: boolean;
	handleClose: (
		event: React.SyntheticEvent<HTMLElement, Event>
	) => void
}

interface ModalButtonProps {
	handleOpen: (
		event: React.SyntheticEvent<HTMLElement, Event>
	) => void;
	text: string;
	color?: "inherit" | "primary" | "secondary" | "default";
}

interface StepModalState {
	isOpen: boolean;
}

export enum StepModalSelect {
	OPEN = 'open',
	CLOSE = 'close'
}

export interface StepModalAction {
	type: StepModalSelect;
	value?: keyof StepModalState
}

export interface StepModalProviderValue {
	readonly state: StepModalState;
	dispatch?: React.Dispatch<StepModalAction>;
}

const initialState = {
	isOpen: false
} as StepModalState;

const StepModalProvider = React.createContext<StepModalProviderValue>({
	state: initialState,
})

const ModalButton: React.FC<ModalButtonProps> = (props) => {
	const { handleOpen, text, color } = props;
	return (
		<Button type="button" color={color} onClick={($e) => handleOpen($e)}>
			{text}
		</Button>)
}

const reduce = (state: StepModalState, action: StepModalAction) => {
	const { type }: { type: StepModalSelect } = action;
	switch (type) {
		case StepModalSelect.OPEN: return { isOpen: true };
		case StepModalSelect.CLOSE: return { isOpen: false };
		default: return state;
	}
}

const StepModal: React.FC<StepModalProps> = (props) => {
	const { children, handleClose, open } = props;
	const [state, dispatch] = useReducer(reduce, initialState);
	const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	useEffect(() => {
		console.log('StepModal loaded!');
	}, [])

	useEffect(() => {
		open ? dispatch({ type: StepModalSelect.OPEN }) : dispatch({ type: StepModalSelect.CLOSE });
	}, [open])
	return (
		<StepModalProvider.Provider value={{ state, dispatch }}>
			<Dialog
				open={state.isOpen}
				onClose={handleClose}
				fullWidth={fullScreen}
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
			>
				<DialogTitle id="step-modal-title">Step Modal</DialogTitle>
				<DialogContent>
					{children}
				</DialogContent>
				<DialogActions>
					<ModalButton
						text="Close Modal"
						handleOpen={handleClose}
					/>
					<ModalButton
						text="Send"
						color="primary"
						handleOpen={($e) => console.log('cliquei')}
					/>
        </DialogActions>
			</Dialog>
		</StepModalProvider.Provider>
	);
}

export default React.memo(StepModal);