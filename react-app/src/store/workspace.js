
const LOAD_WORKSPACE = "/channels/LOAD_WORKSPACE";
const GET_WORKSPACES = "/workspaces/GET_WORKSPACES";
const GET_USER_WORKSPACES = "/workspaces/GET_USER_WORKSPACES"

const getWorkspacesAction = (workspaces) => ({
  type: GET_WORKSPACES,
  workspaces
})

const loadWorkspaceAction = (workspace) => ({
  type: LOAD_WORKSPACE,
  workspace
})

const getUserWorkspacesAction = (userWorkspaces) => ({
  type: GET_USER_WORKSPACES,
  userWorkspaces
})


export const getWorkspacesThunk = () => async (dispatch) => {
  const res = await fetch("/api/workspaces");
  if (res.ok) {
    const workspaces = await res.json();
    console.log("workspaces after getting all", workspaces.workspaces);
    dispatch(getWorkspacesAction(workspaces.workspaces));
    return workspaces;
  } else {
    return "get all workspace err";
  }
}

export const loadWorkspacesThunk = (id) => async (dispatch) => {
  const res = await fetch(`/api/workspaces/${id}`);
  if (res.ok) {
    const workspace = await res.json();
    console.log("loadworkspaceattempt", workspace.workspace);
    dispatch(loadWorkspaceAction(workspace.workspace));
    return workspace;
  } else {
    return "get all workspace err";
  }
}

export const getUserWorkspacesThunk = () => async (dispatch) => {
  const res = await fetch("/api/users/workspaces");
  if (res.ok) {
    const userWorkspaces = await res.json();
    console.log("userworkspaces after getting all", userWorkspaces.workspaces);
    dispatch(getUserWorkspacesAction(userWorkspaces.workspaces));
    return userWorkspaces;
  } else {
    return "get  userWorkspaces err";
  }
}

//reducer
const initalState = {
  allWorkspaces: [],
  userWorkspaces: [],
  currWorkspace: false,
}

const workspaceReducer = (state = initalState, action) => {
  switch (action.type) {
    case GET_USER_WORKSPACES:{
      const newState = {...state, userWorkspaces: []};
      newState.userWorkspaces = action.userWorkspaces;
      return newState
    }
    case GET_WORKSPACES:{
      const newState = {...state, allWorkspaces: []};
      newState.allWorkspaces = action.workspaces;
      return newState;
    }
    case LOAD_WORKSPACE: {
      const newState = { ...state, currWorkspace: {} };
      newState.currWorkspace = action.workspace;
      console.log('load workspace', action.workspace.id);
      return newState;
    }
    default:
      return state;
  }
}

export default workspaceReducer;
