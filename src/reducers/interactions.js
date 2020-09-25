const INITIAL_STATE = {
    interactions: null,
  };
  
  const applySetOrder = (state, action) => ({
    ...state,
    interactions: action.interactions
  });
  
  function interactionsReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
      case 'SET_INTERACTIONS' : {
        console.log(action.interactions)
        return applySetOrder(state, action);
      }
      default : return state;
    }
  }
  
  export default interactionsReducer;