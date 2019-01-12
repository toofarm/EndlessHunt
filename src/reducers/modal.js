const INITIAL_STATE = {
    jobModal: false,
    interactionModal: false,
    job: null,
    interaction: null
  };
  
  const applySetInactive = (state, action) => ({
    ...state,
    jobModal: action.jobModal,
    interactionModal: action.interactionModal,
    job: action.job,
    interaction: action.interaction
  });
  
  function modalStateReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
      case 'SET_MODAL_STATE' : {
        return applySetInactive(state, action);
      }
      default : return state;
    }
  }
  
  export default modalStateReducer; 