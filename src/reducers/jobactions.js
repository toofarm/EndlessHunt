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
    console.log(action)
    switch(action.type) {
      case 'TOGGLE_UI_CONTROLS' : {
        return applySetOrder(state, action);
      }
      default : return state; 
    }
  }
  
  export default controlsReducer;