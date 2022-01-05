import rootReducer from '../reducers/rootReducer';
import { initialState } from './initialState';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const configureStore = () => {
  return createStore(rootReducer, initialState, applyMiddleware(thunk));
};

export default configureStore;
