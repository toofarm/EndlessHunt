const INITIAL_STATE = {
    items: null,
  };
  
  const applySetOrder = (state, action) => ({
    ...state,
    items: action.items
  });
  
  function wishlistReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
      case 'SET_WISHLIST' : {
        return applySetOrder(state, action);
      }
      default : return state;
    }
  }
  
  export default wishlistReducer;