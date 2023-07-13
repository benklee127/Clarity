const GET_ALL_CHANNELS = "/channels/GET_ALL_CHANNELS";
const GET_USER_CHANNELS = "/channels/GET_USER_CHANNELS";
const GET_CHANNEL_USERS = "/channels/GET_CHANNEL_USERS"
const GET_CHANNEL = "/channels/GET_CHANNEL";
const GET_CHANNEL_MESSAGES = "/channels/GET_CHANNEL_MESSAGES";
const CREATE_CHANNEL = "/channels/CREATE_CHANNEL";
const POST_CHANNEL = "/channels/POST_CHANNEL";
const JOIN_CHANNEL = "/channels/JOIN_CHANNEL";


const getAllChannelsAction = () => {
    type: GET_ALL_CHANNELS
}

const getUserChannelsAction = () => {
    type: GET_USER_CHANNELS
}

const getChannelAction = () => {
    type: GET_CHANNEL
}

const getChannelMessagesAction = () => {
    type: GET_CHANNEL_MESSAGES
}

const createChannelAction = () => {
    type: CREATE_CHANNEL
}

const joinChannelAction = () => {
    type: JOIN_CHANNEL
}
