import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./CreateChannelModal.css";
import {
  createChannelThunk,
  loadChannel,
  updateChannelThunk,
} from "../../store/channel";

function CreateChannelModal({ type, channelId }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  console.log("channelId", channelId);
  console.log("type", type);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newChannel = {
      title: title,
      description: description,
    };
    let data;
    if (type === "create") {
      data = await dispatch(createChannelThunk(newChannel));
    } else if (type === "update") {
      console.log("update channel");
      data = await dispatch(updateChannelThunk(newChannel, channelId));
    }
    if (data) {
      setErrors(data);
    } else {
      closeModal();
    }
  };

  return (
    <div className="create-channel-modal">
      <h1>{type == "create" ? "Create a Channel" : "Update a channel"}</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Description
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <button type="submit">{type == "create" ? "Create" : "Update"}</button>
      </form>
    </div>
  );
}

export default CreateChannelModal;
