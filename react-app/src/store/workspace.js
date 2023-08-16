import { RESERVED_EVENTS } from "socket.io/dist/socket";

const LOAD_WORKSPACE = "/channels/LOAD_WORKSPACE";
const GET_WORKSPACES = "/workspaces/GET_WORKSPACES";
const GET_USER_WORKSPACES = "/workspaces/GET_USER_WORKSPACES"
const CREATE_WORKSPACE = "/workspaces/CREATE_WORKSPACE"
const UPDATE_WORKSPACE = "/workspaces/UPDATE_WORKSPACE"

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

const createWorkspaceAction = (workspace) => ({
  type: CREATE_WORKSPACE,
  workspace
})

const updateWorkspaceAction = (workspace) => ({
  type: UPDATE_WORKSPACE,
  workspace
})

export const createWorkspaceThunk = (workspace) => async (dispatch) => {
  const res = await fetch("/api/workspaces/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workspace),
  });
  if (res.ok) {
    const workspace = await res.json();
    dispatch(createWorkspaceAction(workspace));
    dispatch(joinWorkspaceThunk(workspace.id))
    console.log("workspace.id", workspace.id);
    return null;
  } else if (res.status < 500) {
    const data = await res.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
}

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

export const joinWorkspaceThunk = (id) => async (dispatch) => {
  const res = await fetch(`/api/workspaces/join/${id}`)
  if(res.ok) {
    const workspace = await res.json();
    dispatch(loadWorkspaceAction(workspace.workspace))
    return workspace;
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

export const updateWorkspaceThunk = (id, updateWorkspace) => async (dispatch) => {
  const res = await fetch (`/api/workspaces/update/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateWorkspace),
  });
  if (res.ok) {
    const updated_workspace = await res.json();
    console.log("channels after res", updated_workspace);
    dispatch(updateWorkspaceAction(updated_workspace));
    // return channels.channels;
  } else {
    return "create channel err";
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
    case CREATE_WORKSPACE: {
      const newState = { ...state, currWorkspace: {} };
      newState.currWorkspace = action.workspace;
      console.log('action.workspace', action.workspace);
      console.log('load workspace', action.workspace.id);
      return newState;
    }
    case UPDATE_WORKSPACE: {
      const newState = { ...state, currWorkspace: {} };
      newState.currWorkspace = action.workspace;
      return newState;
    }
    default:
      return state;
  }
}

export default workspaceReducer;
