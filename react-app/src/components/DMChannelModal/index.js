import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import "./DMChannelModal.css";
import {
  createChannelThunk,
  loadChannel,
  updateChannelThunk,
} from "../../store/channel";

function DMChannelModal({ otherUser, channelId }) {
  const dispatch = useDispatch();
  const currChannel = useSelector((state) => state.channels.currChannel);
  const sessionUser = useSelector((state) => state.session.user);

  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const [selectedMenu, setSelectedMenu] = useState(1);
  const [editDesc, setEditDesc] = useState(false);
  const [description, setDescription] = useState(currChannel.description || "");
  console.log("channelId", channelId);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newChannel = {
      description: description,
    };
    let data;

    data = await dispatch(updateChannelThunk(newChannel, channelId));

    if (data) {
      setErrors(data);
    } else {
      setEditDesc(false);
    }
  };
  console.log("currChannel", currChannel.title);

  const discardChanges = () => {
    setEditDesc(false);
  };

  const cancelCreate = () => {
    closeModal();
  };

  const toggleEditDesc = () => {
    setEditDesc(true);
  };

  const owner = currChannel.user_id == sessionUser.id;

  return (
    <div className="create-channel-modal">
      <div className="dm-channel-card-header-wrapper">
        <div className="dm-cc-header">
          <img src={otherUser.profile_photo} className="dm-profile-photo" />
          {otherUser.first_name} {otherUser.last_name}
        </div>

        <div className="cc-header-menu">
          <div className="cc-header-menu-option-wrapper">
            <div
              className={
                "cc-header-menu-option" +
                (selectedMenu === 1 ? "-selected" : "")
              }
              onClick={() => setSelectedMenu(1)}
            >
              About
            </div>
          </div>
        </div>
      </div>
      <div onSubmit={handleSubmit} className="channel-form">
        {errors.length > 0 ? (
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        ) : (
          ""
        )}
        <div className="cc-form-item" onClick={() => toggleEditDesc()}>
          <div className="form-input-header">
            <div>Topic (optional)</div>

            {editDesc ? (
              <div
                className={
                  "char-counter" + (description.length >= 100 ? "-max" : "")
                }
              >
                {" "}
                {description.length + "/100"}
              </div>
            ) : (
              ""
            )}
          </div>
          {editDesc ? (
            <textarea
              type="textarea"
              value={description}
              maxLength={100}
              onChange={(e) => setDescription(e.target.value)}
            />
          ) : (
            currChannel.description
          )}
        </div>
        {editDesc ? (
          <div className="cc-form-item-save">
            <div className="cc-update-buttons">
              <div className="cc-update-save" onClick={handleSubmit}>
                Save
              </div>
              <div className="cc-update-cancel" onClick={discardChanges}>
                Cancel
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {/* <div className="cc-form-item bottom">Leave Channel</div> */}
      </div>
    </div>
  );
}

export default DMChannelModal;
