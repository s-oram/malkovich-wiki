import { createStore } from 'react-hooks-global-state';
import { Action, createActions } from './store/actions';
import { State, initialState as defaultState } from './store/state';
import { reduce } from './store/reducer';
import Config from './config';

// TODO:LOW This code is ugly. Can it be cleaned up?

// TODO:MED Refactor to remove usage of global variables.
// - exposed global variables should be returned from a function.
// - the config values should be passed in as an argument to the function.

const devStateKey = 'devState';

const devReducer = (state: State, action: Action): State => {
    const newState = reduce(state, action);
    if (Config.persistApplicationState) {
        sessionStorage.setItem(devStateKey, JSON.stringify(newState));
    } else {
        sessionStorage.removeItem(devStateKey);
    }
    return newState;
}

const selectedReducer = Config.isDev
    ? devReducer
    : reduce;

const savedState = Config.isDev && Config.persistApplicationState && sessionStorage.getItem(devStateKey);
const initialState = savedState
    ? JSON.parse(savedState)
    : defaultState;


const store = createStore<State, Action>(selectedReducer, initialState);
const { GlobalStateProvider, dispatch, useGlobalState } = store;
const actions = createActions(dispatch);

export { GlobalStateProvider, useGlobalState, actions };





