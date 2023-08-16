import React, { useEffect, useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import "./UpdateWorkspaceModal.css";
import {
  createChannelThunk,
  loadChannel,
  updateChannelThunk,
} from "../../store/channel";
import { updateWorkspaceThunk } from "../../store/workspace";

function UpdateWorkspaceModal({type = 'update'}) {
  const dispatch = useDispatch();
  const currWorkspace = useSelector((state) => state.workspaces.currWorkspace);
  const sessionUser = useSelector((state) => state.session.user);
  const allWorkspaces = useSelector((state) => state.workspaces.allWorkspaces);


  console.log("allChannelArr", allWorkspaces);
  const workspaceTitles = allWorkspaces.map((workspace) => workspace.title);
  console.log("allChannel title", workspaceTitles);
  const creatorId = currWorkspace.user_id;

  const [title, setTitle] = useState(currWorkspace.title);
  const [description, setDescription] = useState(currWorkspace.description);
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const [selectedMenu, setSelectedMenu] = useState(1);
  const [editTitle, setEditTitle] = useState(false);
  const [editDesc, setEditDesc] = useState(false);



  const handleSubmit = async (e) => {
    e.preventDefault();
    const newWorkspace = {
      title: title,
      description: description,
    };
    let data;
    if (title.length < 3) {
      setErrors([...errors, "Title must be at least 3 characters"]);
      return;
    }
    if (title != currWorkspace.title && workspaceTitles.includes(title)) {
      setErrors([...errors, "Title must be unique"]);
      return;
    }


      data = await dispatch(updateWorkspaceThunk(currWorkspace.id, newWorkspace));

    if (data) {
      setErrors(data);
    } else {
      setEditTitle(false);
      setEditDesc(false);
    }
  };
  console.log("currWorkspace", currWorkspace.title);

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

  const owner = currWorkspace.user_id == sessionUser.id;

  return (
    <div className="create-channel-modal">
      <div className="channel-card-header-wrapper">
        <div className={"cc-header"}>
          {"#" + currWorkspace.title}
        </div>
        {true ? (
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
            {currWorkspace.user_id == sessionUser.id ? (
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
                <div>Workspace name</div>
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
                currWorkspace.title
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
                currWorkspace.description
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
        //   currWorkspace.user_id == sessionUser.id ? (
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

export default UpdateWorkspaceModal;
