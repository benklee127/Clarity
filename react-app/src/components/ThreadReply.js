import "./Home.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMessageThunk,
  getChannelMessages,
  updateMessageThunk,
} from "../store/channel";
import { getMessageThread, createThreadReplyThunk, updateThreadReplyThunk, deleteThreadReplyThunk } from "../store/thread";
// import MessageForm from "./MessageForm";
// import { postMessageThunk } from "../store/channel";
// import OpenModalButton from "./OpenModalButton";

export default function ThreadReply({reply}) {
  const sessionUser = useSelector((state) => state.session.user);
  const allUsers = useSelector((state) => state.users.allUsers);
  const currChannel = useSelector((state) => state.channels.currChannel);
  const [errors, setErrors] = useState([]);
  const [newContent, setNewContent] = useState(reply.content);
  const channelMessages = useSelector(
    (state) => state.channels.channelMessages
  );
  const currThread = useSelector((state) => state.threads.currThread)

  const [showEditForm, setShowEditForm] = useState(false);
  const dispatch = useDispatch();
  // console.log("message in ", message);

  useEffect(() => {}, [newContent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newThreadReply = {
      content: newContent,
    };
    const data = await dispatch(updateThreadReplyThunk(newThreadReply, reply.message_id));
    setShowEditForm(false);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const data = await dispatch(deleteThreadReplyThunk(reply.id));
  };
  const toggleEdit = () => {
    // console.log("toggle attempt", showEditForm);
    setShowEditForm(!showEditForm);
  };


  const closeEdit = () => setShowEditForm(false);

  const messageEditClass = "message-edit" + (showEditForm ? "" : " hidden");

  if (reply == {} || !reply || !reply.user) return "";

  // console.log("message", reply);
  return (<div>
    <div className="message">
      <div className="image-column">
        <div className="image-wrapper">
          <img src={reply.user.profile_photo} />
        </div>
      </div>
      <div className="message-column">
        <div className="message-header">
          <div className="message-name-date-wrapper">
            {reply.user.first_name + " " + reply.user.last_name + " "}
            <div className="message-date">{reply.created_at}</div>
          </div>
          <div className="comment-button">

          {reply.user_id === sessionUser.id ? (
            <>
              <button onClick={toggleEdit} className="comment-edit-button">
                <i class="fa-regular fa-pen-to-square"></i>
              </button>
              <button onClick={handleDelete} className="comment-edit-button">
                <i class="fa-solid fa-trash-can">&nbsp;</i>
              </button>
              </>
          ) : (
            ""
          )}
          </div>
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
            reply.content
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
