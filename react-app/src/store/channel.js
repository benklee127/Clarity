const GET_ALL_CHANNELS = "/channels/GET_ALL_CHANNELS";
const GET_USER_CHANNELS = "/channels/GET_USER_CHANNELS";
const GET_CHANNEL_USERS = "/channels/GET_CHANNEL_USERS";
const GET_CHANNEL = "/channels/GET_CHANNEL";
const GET_CHANNEL_MESSAGES = "/channels/GET_CHANNEL_MESSAGES";
const CREATE_CHANNEL = "/channels/CREATE_CHANNEL";
const DELETE_CHANNEL = "/channels/DELETE_CHANNEL";
const POST_CHANNEL = "/channels/POST_CHANNEL";
const JOIN_CHANNEL = "/channels/JOIN_CHANNEL";
const LOAD_CHANNEL = "/channels/LOAD_CHANNEL";
const POST_MESSAGE = "/channels/POST_MESSAGE";
const UPDATE_CHANNEL = "/channels/UPDATE_CHANNEL";
const SELECT_CHAT = "/channels/SELECT_CHAT";

const UPDATE_MESSAGE = "/channels/UPDATE_MESSAGE";
const DELETE_MESSAGE = "/channels/DELETE_MESSAGE";


const getAllChannelsAction = (channels) => ({
  type: GET_ALL_CHANNELS,
  payload: channels,
});

const getUserChannelsAction = (channels) => ({
  type: GET_USER_CHANNELS,
  payload: channels,
});

const loadChannelAction = (channel) => ({
  type: LOAD_CHANNEL,
  payload: channel,
});

const getChannelAction = (channel) => ({
  type: GET_CHANNEL,
  payload: channel,
});

const getChannelMessagesAction = (messages) => ({
  type: GET_CHANNEL_MESSAGES,
  payload: messages,
});

const createChannelAction = (channels) => ({
  type: CREATE_CHANNEL,
  payload: channels,
});

const updateChannelAction = (channel) => ({
  type: UPDATE_CHANNEL,
  payload: channel,
});

const postMessageAction = (message) => ({
  type: POST_MESSAGE,
  payload: message,
});

const deleteChannelAction = () => ({
  type: DELETE_CHANNEL,
  payload: "none",
});

const updateMessageAction = (message) => ({
  type: UPDATE_MESSAGE,
  payload: message,
});
const deleteMessageAction = (message) => ({
  type: DELETE_MESSAGE,
  payload: message,
});

const selectChatAction = (channels) => ({
  type: SELECT_CHAT,
  payload: channels,
});

// const joinChannelAction = (channel) => {
//   type: JOIN_CHANNEL;
//   payload: channel;
// };

//helpers
export const loadChannel = (channel) => async (dispatch) => {
  console.log("channel in load channel", channel);
  dispatch(loadChannelAction(channel));
  return channel;
};


//thunks
export const getAllChannelsThunk = (id) => async (dispatch) => {
  const res = await fetch(`/api/channels/workspace/${id}`);
  if (res.ok) {
    const channels = await res.json();
    console.log("channels after getting all", channels.channels);
    dispatch(getAllChannelsAction(channels.channels));
    return channels;
  } else {
    return "get all channels err";
  }
};

export const getChannelMessages = (channelId) => async (dispatch) => {
  console.log("get channel messages of ", channelId);
  const res = await fetch(`/api/channels/messages/${channelId}`);

  if (res.ok) {
    const messages = await res.json();
    console.log("channels after getting all", messages);
    const messagesArr = messages["messages"];
    console.log("messages", messagesArr);
    dispatch(getChannelMessagesAction(messagesArr));
    return messagesArr;
  } else {
    return "get channel messages err";
  }
};

export const postMessageThunk = (message) => async (dispatch) => {
  const res = await fetch(`/api/channels/post/${message.channel_id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });

  if (res.ok) {
    const messages = await res.json();
    const messagesArr = messages["messages"];
    // console.log("messages", )
    dispatch(getChannelMessagesAction(messagesArr));
    return messagesArr;
  } else {
    return "post message err";
  }
};

export const createChannelThunk = (channel, workspace_id) => async (dispatch) => {
  console.log("channels thunk before res", channel);
  const res = await fetch(`/api/channels/createwsgc/${workspace_id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(channel),
  });
  if (res.ok) {
    const channels = await res.json();
    dispatch(createChannelAction(channels.channels));
    console.log("channel.id", channel.id);
    return null;
  } else if (res.status < 500) {
    const data = await res.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

export const updateChannelThunk = (channel, channelId) => async (dispatch) => {
  const res = await fetch(`/api/channels/update/${channelId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(channel),
  });

  if (res.ok) {
    const update_channel = await res.json();
    console.log("channels after res", update_channel);
    dispatch(updateChannelAction(update_channel));
    // return channels.channels;
  } else {
    return "create channel err";
  }
};

export const updateMessageThunk =
  (newMessage, messageId) => async (dispatch) => {
    const res = await fetch(`/api/channels/messageupdate/${messageId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMessage),
    });

    if (res.ok) {
      const messages = await res.json();
      const messagesArr = messages["messages"];
      // console.log("messages", )
      dispatch(getChannelMessagesAction(messagesArr));
      return messagesArr;
    } else {
      return "create channel err";
    }
  };

export const selectChatThunk = (key) => async (dispatch) => {
  console.log("chat thunk before res", key);
  const res = await fetch(`/api/channels/selectdm/${key}`);
  if (res.ok) {
    const chat = await res.json();
    dispatch(selectChatAction(chat));
    return chat;
  } else {
    return "create channel err";
  }
};

export const deleteMessageThunk =
  (messageId, channelId) => async (dispatch) => {
    const res = await fetch(
      `/api/channels/deletemessage/${messageId}/${channelId}`
    );
    if (res.ok) {
      const messages = await res.json();
      const messagesArr = messages["messages"];
      // console.log("messages", )
      dispatch(getChannelMessagesAction(messagesArr));
      return messagesArr;
    } else {
      return "create channel err";
    }
  };

export const deleteChannelThunk = (channelId) => async (dispatch) => {
  const res = await fetch(`/api/channels/delchannel/${channelId}`);
  if (res.ok) {
    const channels = await res.json();
    const channelArr = channels["channels"];
    // console.log("messages", )
    dispatch(getChannelMessagesAction(channelArr));
    dispatch(deleteChannelAction());
    return channelArr;
  } else {
    return "create channel err";
  }
};

//reducer
const initialState = {
  allChannels: [],
  userChannels: [],
  currChannel: {},
  channelMessages: [],
  // allChats: [],
  currWorkspace: -1,
};

const channelReducer = (state = initialState, action) => {
  switch (action.type) {
    // case LOAD_WORKSPACE: {
    //   const newState = {...state}
    //   return newState
    // }
    case GET_ALL_CHANNELS: {
      const newState = { ...state, allChannels: [] };
      newState.allChannels = action.payload;
      return newState;
    }
    case LOAD_CHANNEL: {
      const newState = { ...state, currChannel: {} };
      newState.currChannel = action.payload;
      return newState;
    }
    case GET_CHANNEL_MESSAGES: {
      console.log("get payload channel messages in reducer", action.payload);
      const newState = { ...state, channelMessages: [] };
      if (action.payload) {
        const sorted = action.payload.sort((a, b) => {
          let keyA = a.id;
          let keyB = b.id;
          if (keyA < keyB) return -1;
          else return 1;
        });
        newState.channelMessages = sorted;
      } else {
        newState.channel = action.payload;
      }
      return newState;
    }
    case CREATE_CHANNEL: {
      const newState = { ...state, allChannels: [] };
      newState.allChannels = action.payload;
      return newState;
    }
    case UPDATE_CHANNEL: {
      const newState = {
        ...state,
        currChannel: { ...state.currChannel },
      };
      newState.currChannel = action.payload;
      console.log("newState in update channel", newState);
      return newState;
    }
    case DELETE_CHANNEL: {
      const newState = { ...state, currChannel: {} };
      newState.currChannel = {};
      console.log("currchanel in delete channel", newState.currChannel);
      return newState;
    }
    case SELECT_CHAT: {
      const newState = { ...state, currChannel: {} };
      newState.currChannel = action.payload;
      return newState;
    }
    default:
      return state;
  }
};

export default channelReducer;
