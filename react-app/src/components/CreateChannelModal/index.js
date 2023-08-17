import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import "./CreateChannelModal.css";
import {
  createChannelThunk,
  loadChannel,
  updateChannelThunk,
} from "../../store/channel";

function CreateChannelModal({ type, channelId }) {
  const dispatch = useDispatch();
  const currChannel = useSelector((state) => state.channels.currChannel);
  const sessionUser = useSelector((state) => state.session.user);
  const allChannels = useSelector((state) => state.channels.allChannels);
  const currWorkspace = useSelector((state) => state.workspaces.currWorkspace)
  // console.log("allChannelArr", allChannels);
  const channelTitles = allChannels.map((channel) => channel.title);
  // console.log("allChannel title", channelTitles);
  const creatorId = currChannel.user_id;
  // console.log("type", type);
  const [title, setTitle] = useState(type == "create" ? "" : currChannel.title);
  const [description, setDescription] = useState(
    type == "create" ? "" : currChannel.description
  );
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const [selectedMenu, setSelectedMenu] = useState(1);
  const [editTitle, setEditTitle] = useState(type == "create");
  const [editDesc, setEditDesc] = useState(type == "create");
  // console.log("channelId", channelId);
  // console.log("type", type);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newChannel = {
      title: title,
      description: description,
    };
    let data;
    if (title.length < 3) {
      setErrors([...errors, "Title must be at least 3 characters"]);
      return;
    }
    if (title != currChannel.title && channelTitles.includes(title)) {
      setErrors([...errors, "Title must be unique"]);
      return;
    }

    if (type === "create") {
      data = await dispatch(createChannelThunk(newChannel, currWorkspace.id));
      closeModal();
    } else if (type === "update") {
      // console.log("update channel");
      data = await dispatch(updateChannelThunk(newChannel, channelId));
    }
    if (data) {
      setErrors(data);
    } else {
      setEditTitle(false);
      setEditDesc(false);
    }
  };
  // console.log("currChannel", currChannel.title);

  const discardChanges = () => {
    setErrors([]);
    setEditTitle(false);
    setEditDesc(false);
  };

  const cancelCreate = () => {
    setErrors([]);
    closeModal();
  };

  const toggleEditTitle = () => {
    if (owner) {
      setErrors([]);
      setEditTitle(true);
    }
  };

  const toggleEditDesc = () => {
    if (owner) {
      setErrors([]);
      setEditDesc(true);
    }
  };

  const owner = currChannel.user_id == sessionUser.id;

  return (
    <div className="create-channel-modal">
      <div className="channel-card-header-wrapper">
        <div className={"cc-header"}>
          {type == "create" ? "Create a Channel" : "#" + currChannel.title}
        </div>
        {type == "update" ? (
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
            <div className="cc-header-menu-option-wrapper">
              <div
                className={
                  "cc-header-menu-option" +
                  (selectedMenu === 2 ? "-selected" : "")
                }
                onClick={() => setSelectedMenu(2)}
              >
                Members
              </div>
            </div>
            {currChannel.user_id == sessionUser.id ? (
              <div className="cc-header-menu-option-wrapper">
                <div
                  className={
                    "cc-header-menu-option" +
                    (selectedMenu === 3 ? "-selected" : "")
                  }
                  onClick={() => setSelectedMenu(3)}
                >
                  Settings
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </div>
      {
        selectedMenu == 1 ? (
          <div onSubmit={handleSubmit} className="channel-form">
            {errors.length > 0 ? (
              <ul>
                {errors.map((error) => (
                  <li className="auth-form-error">{error}</li>
                ))}
              </ul>
            ) : (
              ""
            )}
            <div className="cc-form-item" onClick={() => toggleEditTitle()}>
              <div className="form-input-header">
                <div>Channel name</div>
                {editTitle ? (
                  <div
                    className={
                      "char-counter" +
                      (title.length >= 20 || title.length <= 2 ? "-max" : "")
                    }
                  >
                    {" "}
                    {title.length + "/20"}
                  </div>
                ) : (
                  ""
                )}
              </div>
              {editTitle ? (
                <textarea
                  type="textarea"
                  value={title}
                  minLength={1}
                  maxLength={20}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              ) : (
                currChannel.title
              )}
            </div>
            <div className="cc-form-item" onClick={() => toggleEditDesc()}>
              <div className="form-input-header">
                <div>Description (optional)</div>

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
            {type == "create" || editDesc || editTitle ? (
              <div className="cc-form-item-save">
                {type == "create" ? (
                  <div className="cc-update-buttons">
                    <div className="cc-update-save" onClick={handleSubmit}>
                      Create Channel
                    </div>
                    <div className="cc-update-cancel" onClick={cancelCreate}>
                      Cancel
                    </div>
                  </div>
                ) : (
                  <div className="cc-update-buttons">
                    <div className="cc-update-save" onClick={handleSubmit}>
                      Save
                    </div>
                    <div className="cc-update-cancel" onClick={discardChanges}>
                      Cancel
                    </div>
                  </div>
                )}
              </div>
            ) : (
              ""
            )}
            {/* <div className="cc-form-item bottom">Leave Channel</div> */}
          </div>
        ) : selectedMenu == 2 ? (
          <div className="channel-form">
            <div className="cc-form-item">Feature coming soon!</div>
          </div>
        ) : (
          <div className="channel-form">
            <div className="cc-form-item">Feature coming soon!</div>
          </div>
        )

        // selectedMenu == 3 ? (
        //   currChannel.user_id == sessionUser.id ? (
        //     <div className="channel-form">
        //       <div className="cc-delete">
        //         <div className="cc-delete-button">Delete this channel</div>
        //       </div>
        //     </div>
        //   ) : (
        //     <div className="channel-form">
        //       <div className="cc-update-buttons">
        //         Must be channel creator to access settings!
        //       </div>
        //     </div>
        //   )
        // ) : (
        //   ""
        // )
      }
    </div>
  );
}

export default CreateChannelModal;
