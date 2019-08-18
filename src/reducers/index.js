import { combineReducers } from 'redux';
import sessionReducer from './session';
import userReducer from './user';
import jobsReducer from './jobs';
import controlsReducer from './jobactions';
import interactionsReducer from './interactions';
import inactiveStateReducer from './inactivestate';
import modalStateReducer from './modal'
import wishlistReducer from './wishlist';
import sortOrderReducer from './sort';

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  userState: userReducer,
  jobsState: jobsReducer,
  controlState: controlsReducer,
  interactionsState: interactionsReducer,
  inactiveState: inactiveStateReducer,
  modalState: modalStateReducer,
  wishlistState: wishlistReducer,
  sortState: sortOrderReducer
});

export default rootReducer;