import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChannelMessages } from "../store/channel";
import MessageForm from "./MessageForm";
import { postMessageThunk } from "../store/channel";
import OpenModalButton from "./OpenModalButton";
import CreateChannelModal from "./CreateChannelModal";
export default function Channel() {
  const currChannel = useSelector((state) => state.channels.currChannel);
  const sessionUser = useSelector((state) => state.session.user);

  const channelMessages = useSelector(
    (state) => state.channels.channelMessages
  );
  const [content, setContent] = useState("");
  const [submitContent, setSubmitContent] = useState("content");
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("useeffect in channel ", currChannel.id);
    dispatch(getChannelMessages(currChannel.id));
  }, [currChannel, submitContent]);

  const postMessage = async (e) => {
    e.preventDefault();
    setSubmitContent(content);
    let newMessage = {
      content: content,
      user_id: sessionUser.id,
      channel_id: currChannel.id,
    };
    console.log("new message", newMessage);
    dispatch(postMessageThunk(newMessage)).then(
      dispatch(getChannelMessages(currChannel.id))
    );
  };

  if (currChannel == {}) return null;
  return (
    <div className="channel-wrapper">
      Channel Component
      <div className="channel-section">
        <div className="channel-header">
          {/* {currChannel} */}
          {
            (currChannel.type = "gc" ? (
              <>
                <div>{currChannel.title}</div>
                <div>{currChannel.description}</div>
                <OpenModalButton
                  buttonText="+"
                  modalComponent={
                    <CreateChannelModal
                      type="update"
                      channelId={currChannel.id}
                    />
                  }
                />
              </>
            ) : (
              <>hi</>
            ))
          }
        </div>
        <div className="channel-gallery">
          Channel Gallery
          <div className="channel-messages">
            {channelMessages && channelMessages.length > 0
              ? channelMessages.map((message) => {
                  return (
                    <div>
                      {message.user.first_name +
                        " " +
                        message.user.last_name +
                        ": "}
                      {message.content}
                    </div>
                  );
                })
              : ""}
          </div>
        </div>
        <div className="channel-message">
          Channel Message Form
          <form onSubmit={postMessage} className="message-form">
            <textarea
              className="message-form-content"
              type="textarea"
              value={content}
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
