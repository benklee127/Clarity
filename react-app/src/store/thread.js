import { RESERVED_EVENTS } from "socket.io/dist/socket";

const GET_MESSAGE_THREAD = "/threads/GET_MESSAGE_THREAD";
const CREATE_THREAD_REPLY = "/threads/CREATE_THREAD_REPLY"
const UPDATE_THREAD_REPLY = "/threads/UPDATE_THREAD_REPLY"
const DELETE_THREAD_REPLY = "/threads/DELETE_THREAD_REPLY"

const getMessageThreadAction = (thread) => ({
  type: GET_MESSAGE_THREAD,
  thread
})

const createThreadReplyAction = (thread) => ({
  type: CREATE_THREAD_REPLY,
  thread
})

const updateThreadReplyAction = (thread) => ({
  type: UPDATE_THREAD_REPLY,
  thread
})

const deleteThreadReplyAction = (thread) => ({
  type: DELETE_THREAD_REPLY,
  thread
})

export const getMessageThread = (messageId) => async(dispatch) => {
    const res = await fetch(`/api/messages/reply/${messageId}`)
    if (res.ok) {
        const thread = await res.json();
        dispatch(getMessageThreadAction(thread.replies));
        return thread;
      } else {
        return "get all workspace err";
      }
}

export const createThreadReplyThunk = (reply) => async (dispatch) => {
    // console.log('hiherecreatethreadreply');
    const res = await fetch("/api/messages/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reply),
    });
    if(res.ok){
        const thread = await res.json()
        dispatch(createThreadReplyAction(thread.replies))
        return "success"
    }  else if (res.status < 500) {
    const data = await res.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
}

export const deleteThreadReplyThunk = (replyId) => async(dispatch) => {
    const res = await fetch(`/api/messages/deletereply/${replyId}`)
    if (res.ok) {
        const thread = await res.json();
        dispatch(getMessageThreadAction(thread.replies));
        return thread;
      } else {
        return "get all workspace err";
      }
}


export const updateThreadReplyThunk = (replyContent, replyId) => async (dispatch) => {
  const res = await fetch (`/api/messages/updatereply/${replyId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(replyContent),
  });
  if (res.ok) {
    const thread = await res.json();
    dispatch(getMessageThreadAction(thread.replies));
    return thread;
  } else {
    return "get all workspace err";
  }
}


//reducer
const initalState = {
  currThread: [],
//   currMessage: {}
}

const threadReducer = (state = initalState, action) => {
  switch (action.type) {
    case GET_MESSAGE_THREAD:{
      const newState = {...state, currThread: []};
      newState.currThread = action.thread;
      return newState
    }
    case UPDATE_THREAD_REPLY:{
        const newState = {...state, currThread: []};
        newState.currThread = action.thread;
        return newState
    }
    case CREATE_THREAD_REPLY:{
        const newState = {...state, currThread: []};
        // console.log('');
        newState.currThread = action.thread;
        return newState
    }
    case DELETE_THREAD_REPLY:{
        const newState = {...state, currThread: []};
        newState.currThread = action.thread;
        return newState
    }
    default:
      return state;
  }
}

export default threadReducer;
