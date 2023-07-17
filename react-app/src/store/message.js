// const UPDATE_MESSAGE = "/messages/UPDATE_MESSAGE";

// export const updateMessageThunk = (message) => async (dispatch) => {
//   const res = await fetch(`/api/message/${message.id}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(message),
//   });

//   if (res.ok) {
//     const messages = await res.json();
//     const messagesArr = messages["messages"];
//     // console.log("messages", )
//     dispatch(getChannelMessagesAction(messagesArr));
//     return messagesArr;
//   } else {
//     return "post message err";
//   }
// };

// const initialState = {};
