const GET_ALL_CHANNELS = "/channels/GET_ALL_CHANNELS";
const GET_USER_CHANNELS = "/channels/GET_USER_CHANNELS";
const GET_CHANNEL_USERS = "/channels/GET_CHANNEL_USERS";
const GET_CHANNEL = "/channels/GET_CHANNEL";
const GET_CHANNEL_MESSAGES = "/channels/GET_CHANNEL_MESSAGES";
const CREATE_CHANNEL = "/channels/CREATE_CHANNEL";
const POST_CHANNEL = "/channels/POST_CHANNEL";
const JOIN_CHANNEL = "/channels/JOIN_CHANNEL";
const LOAD_CHANNEL = "/channels/LOAD_CHANNEL";
const POST_MESSAGE = "/channels/POST_MESSAGE";

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

const createChannelAction = (channel) => ({
  type: CREATE_CHANNEL,
  payload: channel,
});

const postMessageAction = (message) => ({
  type: POST_MESSAGE,
  payload: message,
});

// const joinChannelAction = (channel) => {
//   type: JOIN_CHANNEL;
//   payload: channel;
// };

//thunks
export const getAllChannelsThunk = () => async (dispatch) => {
  const res = await fetch("/api/channels");

  if (res.ok) {
    const channels = await res.json();
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

//helpers
export const loadChannel = (channel) => async (dispatch) => {
  console.log("channel in load channel", channel);
  dispatch(loadChannelAction(channel));
  return channel;
};

//reducer
const initialState = {
  allChannels: [],
  userChannels: [],
  currChannel: {},
  channelMessages: [],
};

const channelReducer = (state = initialState, action) => {
  switch (action.type) {
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
      newState.channelMessages = action.payload;
      return newState;
    }
    default:
      return state;
  }
};

export default channelReducer;
