export const INSERT_QUERY = '@@cashay/INSERT_QUERY';
export const INSERT_MUTATION = '@@cashay/INSERT_MUTATION';
export const SET_VARIABLES = '@@cashay/SET_VARIABLES';
export const SET_ERROR = '@@cashay/SET_ERROR';
import mergeStores from './mergeStores';

const initialState = {
  error: null,
  data: {
    entities: {},
    result: {},
    variables: {}
  }
};

export default function reducer(state = initialState, action) {
  if (action.type === INSERT_QUERY) {
    const {variables, response} = action.payload;
    const newMergedState = mergeStores(state.data, response);
    return variables ? newStateWithVars(state, newMergedState, action.payload) : {...state, data: newMergedState, error: null};
  } else if (action.type === INSERT_MUTATION) {
    const newMergedState = mergeStores(state.data, action.payload.response, true);
    return newStateWithVars(state, newMergedState, action.payload);
  } else if (action.type === SET_VARIABLES) {
    return newStateWithVars(state, {...state.data}, action.payload);
  } else if (action.type === SET_ERROR) {
    return {...state, error: action.error};
  } else {
    return state;
  }
};

const newStateWithVars = (state, newDataState, {variables}) => {
  return Object.assign({}, state, {
    error: null,
    data: Object.assign(newDataState, {
      variables: Object.assign({}, state.data.variables, variables)
    })
  });
};
