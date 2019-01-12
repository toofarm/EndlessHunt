const INITIAL_STATE = {
    users: {},
  };
  
  const applySetUsers = (state, action) => ({
    ...state,
    user: action.user
  });
  
  function userReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
      case 'USER_SET' : {
        return applySetUsers(state, action);
      }
      default : return state;
    }
  }
  
  export default userReducer;