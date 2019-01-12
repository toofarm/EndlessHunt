import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import { handleUserJobs } from '../services/JobsService';
import { handleUser } from '../services/UserService';
import { handleInteractions } from '../services/InteractionsService';
import { handleWishlist } from '../services/WishlistService';

const store = createStore(rootReducer, applyMiddleware(handleUserJobs, handleUser, handleInteractions, handleWishlist));

export default store;