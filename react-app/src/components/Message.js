import "./Home.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMessageThunk,
  getChannelMessages,
  updateMessageThunk,
} from "../store/channel";
// import MessageForm from "./MessageForm";
// import { postMessageThunk } from "../store/channel";
// import OpenModalButton from "./OpenModalButton";

export default function Message({ message }) {
  const sessionUser = useSelector((state) => state.session.user);
  const allUsers = useSelector((state) => state.users.allUsers);
  const currChannel = useSelector((state) => state.channels.currChannel);
  const [errors, setErrors] = useState([]);
  const [newContent, setNewContent] = useState(message.content);
  const channelMessages = useSelector(
    (state) => state.channels.channelMessages
  );
  const [showEditForm, setShowEditForm] = useState(false);
  const dispatch = useDispatch();
  // console.log("message in ", message);

  useEffect(() => {}, [newContent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMessage = {
      content: newContent,
      user_id: sessionUser.id,
    };
    let messageId = message.id;

    const data = await dispatch(updateMessageThunk(newMessage, messageId));
    setShowEditForm(false);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const data = await dispatch(deleteMessageThunk(message.id, currChannel.id));
  };
  const toggleEdit = () => {
    // console.log("toggle attempt", showEditForm);
    setShowEditForm(!showEditForm);
  };
  // const openEdit = () => {
  //   if (showEditForm) return;
  //   else setShowEditForm(true);
  // };
  const closeEdit = () => setShowEditForm(false);

  const messageEditClass = "message-edit" + (showEditForm ? "" : " hidden");

  if (message == {} || !message || !message.user) return "";

  console.log("message", message);
  return (
    <div className="message">
      <div className="image-column">
        <div className="image-wrapper">
          <img src={message.user.profile_photo} />
        </div>
      </div>
      <div className="message-column">
        <div className="message-header">
          <div className="message-name-date-wrapper">
            {message.user.first_name + " " + message.user.last_name + " "}
            <div className="message-date">{message.created_at}</div>
          </div>
          {message.user_id === sessionUser.id ? (
            <div className="comment-button">
              <button onClick={toggleEdit} className="comment-edit-button">
                <i class="fa-regular fa-pen-to-square"></i>
              </button>
              <button onClick={handleDelete} className="comment-edit-button">
                <i class="fa-solid fa-trash-can">&nbsp;</i>
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="message-content">
          {showEditForm ? (
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
                  <button onClick={handleSubmit}>Save</button>
                </div>
              </form>
            </div>
          ) : (
            message.content
          )}
        </div>
      </div>
    </div>
  );
}
