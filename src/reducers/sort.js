const INITIAL_STATE = {
    sortOrder: null
  };
  
  const applySetOrder = (state, action) => ({
    ...state,
    sortOrder: action.order
  });
  
  function sortOrderReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
      case 'SET_SORT_STATE' : {
        return applySetOrder(state, action);
      }
      default : return state; 
    }
  }
  
  export default sortOrderReducer;