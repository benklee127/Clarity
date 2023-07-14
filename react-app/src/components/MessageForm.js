import { useDispatch, useSelector } from "react-redux";
import "./Home.css";
import { useEffect, useState } from "react";

export default function MessageForm() {
  const sessionUser = useSelector((state) => state.session.user);
  const currChannel = useSelector((state) => state.channels.currChannel);
  const [content, setContent] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const postMessage = async (e) => {
    e.preventDefault();
    let newMessage = {
      content: content,
      user_id: sessionUser.id,
      channel_id: currChannel.id,
    };
    console.log("new message", newMessage);
  };

  return (
    <div className="message-form-wrapper">
      <form onSubmit={postMessage} className="message-form">
        <textarea
          className="message-form-content"
          type="textarea"
          value={content}
          maxLength={500}
          onChange={(e) => setMessageContent(e.target.value)}
        ></textarea>
        <button type="submit" className="message-submit">
          Submit
        </button>
      </form>
    </div>
  );
}
