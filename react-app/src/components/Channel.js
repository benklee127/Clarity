import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteChannelThunk, getChannelMessages } from "../store/channel";
import MessageForm from "./MessageForm";
import Message from "./Message";
import { postMessageThunk } from "../store/channel";
import OpenModalButton from "./OpenModalButton";
import CreateChannelModal from "./CreateChannelModal";

export default function Channel(currChannelProp) {
  const currChannel = useSelector((state) => state.channels.currChannel);
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

  useEffect(() => {
    // console.log("useeffect in channel ", currChannel.id);
    console.log("use effect run currchan", currChannel);
    if (currChannel != {} && currChannel != undefined)
      dispatch(getChannelMessages(currChannel.id));
  }, [currChannel, submitContent, channelDeleted, allChannels]);

  const deleteChannel = async (e) => {
    e.preventDefault();
    const data = await dispatch(deleteChannelThunk(currChannel.id));
    setChannelDeleted(true);
    setChannelDeleted(false);
  };

  const postMessage = async (e) => {
    e.preventDefault();
    if (content.length > 0) {
      setSubmitContent(content);
      let newMessage = {
        content: content,
        user_id: sessionUser.id,
        channel_id: currChannel.id,
      };
      console.log("new message", newMessage);
      const data = await dispatch(postMessageThunk(newMessage));
      dispatch(getChannelMessages(currChannel.id));
      setContent("");
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
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
  }

  return (
    <div className="channel-wrapper">
      {/* Channel Component */}
      <div className="channel-section">
        <div className="channel-header">
          {currChannel.chType == "gc" ? (
            <div className="channel-header-wrapper">
              <div className="ch-title"> # {currChannel.title}</div>
              <div className="ch-desc">{currChannel.description}</div>
              <OpenModalButton
                buttonText="+"
                className="ch-button"
                modalComponent={
                  <CreateChannelModal
                    type="update"
                    channelId={currChannel.id}
                  />
                }
              />

              <button onClick={deleteChannel} className="ch-button">
                {" - "}
              </button>
            </div>
          ) : (
            <>
              <div>
                {otherUser
                  ? otherUser.first_name + " " + otherUser.last_name
                  : ""}
              </div>
            </>
          )}
        </div>
        <div className="channel-gallery">
          {/* {currChannel.chType == "gc" ? "Channel Gallery" : "Chat Gallery"} */}
          <div className="channel-messages">
            {currChannel && channelMessages && channelMessages.length > 0
              ? channelMessages.map((message) => {
                  return <Message message={message} />;
                })
              : ""}
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
            >
              text
            </textarea>
            <button type="submit" className="message-submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
