import { GET_ALL_KITS, GET_ALL_TOKENS, GET_USER_KITS, MyAppsActions } from "types/actions/MyApps.actions";
import { Token } from "types/ethereum";
import { Kit } from "types/models/Kit";

const initialState: {
	kitsData: Kit[] | null,
	userkits: Kit[] | null,
	tokenData: Token[] | null
} = {
	kitsData: null,
	userkits: null,
	tokenData: null
};

export default (state = initialState, action: MyAppsActions) => {
	switch (action.type) {
		case GET_ALL_KITS:
			return {
				...state,
				kitsData: action.payload,
			};
		case GET_ALL_TOKENS:
			return {
				...state,
				tokenData: action.payload,
			};

		case GET_USER_KITS:
			return {
				...state,
				userkits: action.payload,
			};

		default:
			return state;
	}
}