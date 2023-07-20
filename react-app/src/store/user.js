const GET_ALL_USERS = "/channels/LOAD_USERS";

const getAllUsersAction = ({ users }) => ({
  type: GET_ALL_USERS,
  payload: users,
});

export const getAllUsersThunk = () => async (dispatch) => {
  const res = await fetch("/api/users/all");
  if (res.ok) {
    const users = await res.json();
    console.log("users in thunk after res", users);
    dispatch(getAllUsersAction(users));
    return users;
  } else {
    return "get all channels err";
  }
};

export const selectChatThunk = (key) => async (dispatch) => {
  const res = await fetch(`/api/users/selectdm/${key}`);
  if (res.ok) {
    const users = await res.json();
    console.log("users in thunk after res", users);
    dispatch(getAllUsersAction(users));
    return users;
  } else {
    return "get all channels err";
  }
};

const initialState = { allUsers: [] };

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_USERS: {
      const newState = { ...state, allUsers: [] };
      console.log("action");
      action.payload.forEach((user) => {
        newState.allUsers[user.id] = user;
      });
      return newState;
    }
    default:
      return state;
  }
};

export default userReducer;
