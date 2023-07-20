import { useDispatch, useSelector } from "react-redux";
import "./Home.css";
import { useEffect, useState } from "react";
import { postMessageThunk } from "../store/channel";

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
    dispatch(postMessageThunk(newMessage));
    setContent("");
  };

  return (
    <div className="message-form-wrapper">
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
  );
}
