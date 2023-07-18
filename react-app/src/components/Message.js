import "./Home.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChannelMessages, updateMessageThunk } from "../store/channel";
import MessageForm from "./MessageForm";
import { postMessageThunk } from "../store/channel";
import OpenModalButton from "./OpenModalButton";

export default function Message({ message }) {
  const sessionUser = useSelector((state) => state.session.user);
  const allUsers = useSelector((state) => state.users.allUsers);
  const [errors, setErrors] = useState([]);
  const [newContent, setNewContent] = useState(message.content);
  const channelMessages = useSelector(
    (state) => state.channels.channelMessages
  );
  const [showEditForm, setShowEditForm] = useState(false);
  const dispatch = useDispatch();
  console.log("message in ", message);

  useEffect(() => {}, [newContent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMessage = {
      content: newContent,
      user_id: sessionUser.id,
    };
    let messageId = message.id;

    const data = await dispatch(updateMessageThunk(newMessage, messageId));
  };

  const toggleEdit = () => {
    console.log("toggle attempt", showEditForm);
    setShowEditForm(!showEditForm);
  };
  // const openEdit = () => {
  //   if (showEditForm) return;
  //   else setShowEditForm(true);
  // };
  const closeEdit = () => setShowEditForm(false);

  const messageEditClass = "message-edit" + (showEditForm ? "" : " hidden");

  return (
    <div className="Message">
      {message.user.first_name + " " + message.user.last_name + ": "}
      {message.content}
      {message.user_id === sessionUser.id ? (
        <>
          <button onClick={toggleEdit}>Edit</button>
          <div className={messageEditClass}>
            <form onSubmit={handleSubmit}>
              <ul>
                {errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                required
                minLength={1}
                maxLength={300}
              />
              <div className="comment-button">
                <button type="submit" onClick={closeEdit}>
                  Save
                </button>
              </div>
            </form>
          </div>
          <button>Delete</button>
        </>
      ) : (
        ""
      )}
    </div>
  );
}