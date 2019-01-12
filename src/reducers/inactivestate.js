const INITIAL_STATE = {
    inactiveState: "showAll"
  };
  
  const applySetInactive = (state, action) => ({
    ...state,
    inactiveState: action.order
  });
  
  function inactiveStateReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
      case 'SET_INACTIVE_STATE' : {
        return applySetInactive(state, action);
      }
      default : return state;
    }
  }
  
  export default inactiveStateReducer;