import { ConfigFile } from "@types";
import { ConfigFileActionTypes, GET_CONFIG_FILE, SET_CONFIG_FILE } from 'types/actions/ConfigFile.actions';

interface ConfigFileState {
  configFile: ConfigFile | null;
}
const initialState: ConfigFileState = {
    configFile: {
        pairs: [],
        tokens: []
    }
}

export default (state = initialState, action: ConfigFileActionTypes): ConfigFileState => {
    switch (action.type) {
        case GET_CONFIG_FILE: {
            state = { configFile: action.payload };
            return state;
        }
        case SET_CONFIG_FILE: {
            state = { configFile: action.payload };
            return state;
        }
        default:{
            return state;
        }
    }
}
