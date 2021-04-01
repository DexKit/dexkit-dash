import { Dispatch } from 'redux';
import { AppActions } from 'types';
import { fetchError, fetchStart, fetchSuccess } from './Common';
import Api from '@crema/services/ApiConfig';
import { GET_CONFIG_FILE, SET_CONFIG_FILE, GetConfigFile, SetConfigFile } from 'types/actions/ConfigFile.actions';
import { ConfigFile } from '@types';

export const onGetConfigFile = () => {
	return (dispatch: Dispatch<AppActions>) => {
		dispatch(fetchStart());
		Api.get('/config-file')
			.then((data) => {
				if (data.status === 200) {
					console.log('onGetConfigFile', data);
					const { data: configFile }: { data: ConfigFile } = data
					dispatch(fetchSuccess());
					dispatch<GetConfigFile>({ type: GET_CONFIG_FILE, payload: configFile });
				} else {
					dispatch(fetchError('Something went wrong, Please try again!'));
				}
			})
			.catch((error) => {
				dispatch(fetchError(error.message));
			});
	};
}

export const onSetConfigFile = (configFile: ConfigFile) => {
	return (dispatch: Dispatch<AppActions>) => {
		dispatch(fetchStart());
		Api.post('/config-file', configFile)
			.then((data) => {
				if (data.status === 200) {
					// const { data: configFile }: { data: ConfigFile } = data
					dispatch(fetchSuccess());
					dispatch<SetConfigFile>({ type: SET_CONFIG_FILE, payload: configFile });
				} else {
					dispatch(fetchError('Something went wrong, Please try again!'));
				}
			})
			.catch((error) => {
				dispatch(fetchError(error.message));
			});
	};

}