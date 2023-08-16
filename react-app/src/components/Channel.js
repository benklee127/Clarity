import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteChannelThunk, getChannelMessages, loadChannel } from "../store/channel";
import MessageForm from "./MessageForm";
import Message from "./Message";
import { postMessageThunk } from "../store/channel";
import OpenModalButton from "./OpenModalButton";
import { OpenModalDiv } from "./OpenModalButton";
import CreateChannelModal from "./CreateChannelModal";
import DMChannelModal from "./DMChannelModal";
import {io} from 'socket.io-client'
import Thread from "./Thread"
let socket;


export default function Channel(currChannelProp) {
  const currChannel = useSelector((state) => state.channels.currChannel);
  const currWorkspace = useSelector((state) => state.ch)
  const sessionUser = useSelector((state) => state.session.user);

  const allChannels = useSelector((state) => state.channels.allChannels);
  const bottomRef = useRef(null);
  const allUsers = useSelector((state) => state.users.allUsers);
  const [channelDeleted, setChannelDeleted] = useState(false);
  const channelMessages = useSelector(
    (state) => state.channels.channelMessages
  );
  const [content, setContent] = useState("");
  const [submitContent, setSubmitContent] = useState("content");
  const dispatch = useDispatch();

  const [showThread, setShowThread] = useState(true)
  const [threadId, setThreadId] = useState();
  useEffect(() => {
    // console.log("useeffect in channel ", currChannel.id);
    console.log("use effect run currchan", currChannel);
    if (currChannel != {} && currChannel != undefined)
      dispatch(getChannelMessages(currChannel.id));
    else if (sessionUser.last_channel != -1){
      dispatch(loadChannel(sessionUser.last_channel))
    }
    //open socket
    socket = io()
    console.log('connected to socket');
    //get messages
    socket.on("chat", (message) => {
      console.log('chat socket triggered');
       let res = dispatch(getChannelMessages(currChannel.id))
       console.log('res', res);
   })

   return (()=>{
    console.log('socket disconnected');
    socket.disconnect()
   })

  }, [currChannel, submitContent, channelDeleted, allChannels]);

  const deleteChannel = async (e) => {
    e.preventDefault();
    const data = await dispatch(deleteChannelThunk(currChannel.id));
    setChannelDeleted(true);
    setChannelDeleted(false);
  };

  const postMessage = async (e) => {
    e.preventDefault();
    if (content.length > 0 && currChannel) {
      setSubmitContent(content);
      let newMessage = {
        content: content,
        user_id: sessionUser.id,
        channel_id: currChannel.id,
      };
      console.log("new message", newMessage);
      // const data = await dispatch(postMessageThunk(newMessage));
      let data = dispatch(getChannelMessages(currChannel.id));
      socket.emit("chat", newMessage)
      setContent("");
      if (data){ bottomRef.current?.scrollIntoView({ behavior: "smooth" });}
    }
  };
  console.log("all users", allUsers);
  let chKey = null;
  if (currChannel == {} || currChannel == undefined) return null;
  else {
    console.log("currChannel", currChannel);
    chKey = currChannel.key;
  }

  let otherUser;
  if (chKey) {
    let ids = chKey.split("_");
    var idNums = ids.map(Number);
    console.log("ids", idNums);
    let otherUserId = idNums[0];
    if (sessionUser.id === idNums[0]) otherUserId = idNums[1];
    console.log("other user", allUsers[otherUserId]);

    otherUser = allUsers[otherUserId];
    console.log('chKey after other user', chKey, 'other', otherUserId);

  }

  const owner = currChannel.user_id == sessionUser.id;
  return (
    <div className="channel-wrapper">
      {/* Channel Component */}
      <div className={"channel-section" + (!showThread ? "-split": "")}>
        <div className="channel-header">
          {currChannel.chType == "gc" ? (
            <div className="channel-header-wrapper">
              <div className="ch-header-section">
                <OpenModalDiv
                  buttonText={
                    <div className="ch-title">
                      {" "}
                      {"# "}
                      {currChannel.title}
                    </div>
                  }
                  modalComponent={
                    <CreateChannelModal
                      type="update"
                      channelId={currChannel.id}
                    />
                  }
                />
                <OpenModalDiv
                  buttonText={
                    <div className="ch-desc">
                      {currChannel.description.length > 50
                        ? currChannel.description.substring(0, 70) + "..."
                        : currChannel.description}
                    </div>
                  }
                  modalComponent={
                    <CreateChannelModal
                      type="update"
                      channelId={currChannel.id}
                    />
                  }
                />
              </div>

              {/* <OpenModalButton
                buttonText={<div>test</div>}
                className="ch-button"
                modalComponent={
                  <CreateChannelModal
                    type="update"
                    channelId={currChannel.id}
                  />
                }
              /> */}
              <div className="ch-header-section">
                {owner ? (
                  <>
                    <OpenModalDiv
                      buttonText={
                        <div className="ch-title">
                          &nbsp;
                          <i class="fa-regular fa-pen-to-square">&nbsp;</i>
                        </div>
                      }
                      modalComponent={
                        <CreateChannelModal
                          type="update"
                          channelId={currChannel.id}
                        />
                      }
                    />
                    <div onClick={deleteChannel} className="ch-title">
                      &nbsp;<i class="fa-solid fa-trash-can">&nbsp;</i>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          ) : (
            <>
              {currChannel != {} ? (
                <div className="dm-header-wrapper">
                  {otherUser ? (
                    <div className="dm-header">
                      <OpenModalDiv
                        buttonText={
                          <div className="dm-header">
                            <div className="dm-header-photo-div">
                              <img
                                src={otherUser.profile_photo}
                                className="dm-header-photo"
                              />
                            </div>
                            <div className="ch-title">
                              {" "}
                              &nbsp;
                              {otherUser
                                ? otherUser.first_name +
                                  " " +
                                  otherUser.last_name
                                : ""}
                            </div>

                            <div className="ch-desc">
                              {currChannel.description
                                ? currChannel.description
                                : "set a topic"}
                            </div>
                            <div className="ch-title">
                              &nbsp;
                              <i class="fa-regular fa-pen-to-square">&nbsp;</i>
                            </div>
                          </div>
                        }
                        modalComponent={
                          <DMChannelModal
                            otherUser={otherUser}
                            channelId={currChannel.id}
                          />
                        }
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                "Select or Create a channel to get started"
              )}
              {/* <div>
                {otherUser
                  ? otherUser.first_name + " " + otherUser.last_name
                  : ""}
              </div> */}
            </>
          )}
        </div>
        <div className="channel-gallery">
          {/* {currChannel.chType == "gc" ? "Channel Gallery" : "Chat Gallery"} */}
          <div className="channel-messages">
            {currChannel && channelMessages && channelMessages.length > 0 ? (
              channelMessages.map((message) => {
                return <Message message={message}
                showThread={showThread}
                setShowThread={setShowThread}
                threadId={threadId}
                setThreadId={setThreadId}
                />;
              })
            ) : currChannel.id ? (
              <div className="channel-help">
                Be the first to send a message!
              </div>
            ) : (
              <div className="channel-help">
                Select a channel to get started!
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>
        <div className="channel-message">
          {/* Channel Message Form */}
          <form onSubmit={postMessage} className="message-form">
            <textarea
              className="message-form-content"
              type="textarea"
              value={content}
              minLength={1}
              maxLength={500}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                currChannel.id
                  ? "Message " +
                    (otherUser ? otherUser.first_name : "#" + currChannel.title)
                  : "Select a channel to get started!"
              }
            >
              text
            </textarea>
            <div className="form-bot-banner">
              <div
                className={
                  "char-counter" + (content.length >= 500 ? "-max" : "")
                }
              >
                {" "}
                {content.length + "/500"}
              </div>
              <button type="submit" className="message-form-button">
                <div className="ch-title">
                  &nbsp;
                  <i class="fa-solid fa-paper-plane">&nbsp;</i>&nbsp;
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
      { !showThread ?
              <Thread showThread={showThread} setShowThread={setShowThread} threadId={threadId}/>
       : ""}
    </div>
  );
}
