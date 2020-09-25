const INITIAL_STATE = {
    order: null,
    data: undefined
  };
  
  const applySetOrder = (state, action) => ({
    ...state,
    order: action.order,
    data: action.data
  });
  
  function controlsReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
      case 'TOGGLE_UI_CONTROLS' : {
        console.log(action)
        return applySetOrder(state, action);
      }
      default : return state; 
    }
  }
  
  export default controlsReducer;