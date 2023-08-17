import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import {createWorkspaceThunk} from "../../store/workspace"
import "./CreateWorkspaceModal.css";
import {
  createChannelThunk,
  loadChannel,
  updateChannelThunk,
} from "../../store/channel";

function CreateWorkspaceModal({type, showJoinChannel, setShowJoinChannel}) {
  const dispatch = useDispatch();
  const currChannel = useSelector((state) => state.channels.currChannel);
  const sessionUser = useSelector((state) => state.session.user);
  const allChannels = useSelector((state) => state.channels.allChannels);
  const currWorkspace = useSelector((state) => state.workspaces.currWorkspace);
  const allWorkspaces = useSelector((state) => state.workspaces.allWorkspaces);


  // console.log("allChannelArr", allWorkspaces);
  const workspaceTitles = allWorkspaces.map((workspace) => workspace.title);
  // console.log("allChannel title", workspaceTitles);

  const [title, setTitle] = useState(type == 'create' ? "": currWorkspace.title);
  const [description, setDescription] = useState("");
  const [icon , setIcon ] =  useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const [editTitle, setEditTitle] = useState(type == "create");
  const [editDesc, setEditDesc] = useState(type == "create");
  const [editIcon, setEditIcon] = useState(type == "create");

  // console.log('type', type);
  let owner = currWorkspace.user_id == sessionUser.id;
  // setErrors([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newWorkspace = {
      title: title,
      description: description,
      icon: icon,
    };
    if(icon.length > 1) {
      newWorkspace.icon = icon
    }
    let data;
    if (title.length < 3) {
      setErrors([...errors, "Title must be at least 3 characters"]);
      return;
    }
    if (title != currWorkspace.title && workspaceTitles.includes(title)) {
      setErrors([...errors, "Workspace title must be unique"]);
      return;
    }
      data = await dispatch(createWorkspaceThunk(newWorkspace));
      setShowJoinChannel(false);
      closeModal();

    if (data) {
      setErrors(data);
    }
  }
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
  const toggleEditIcon = () => {
    if (owner) {
      setErrors([]);
      setEditDesc(true);
    }
  };

  return (
  <div >
    <div className="ws-header">
      {type == 'create' ? "Create your new Workspace" : currWorkspace.title }
    </div>

    <div className='workspace-form'>
    {errors.length > 0 ? (
              <ul>
                {errors.map((error) => (
                  <li className="auth-form-error">{error}</li>
                ))}
              </ul>
            ) : (
              ""
            )}
      {editTitle ? <div className='ws-form-item'>
        <div className="form-input-header">
          Workspace title:
          <div
            className={
              "char-counter" + (title.length >= 50 ? "-max" : "")
            }
          >
            {" "}
            {title.length + "/50"}
          </div>
        </div>
        <textarea
          type="textarea"
          value={title}
          minLength={1}
          maxLength={50}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div> : <div className='ws-form-item'>{currWorkspace.title}</div>}
      {editTitle ? <div className='ws-form-item' >
        <div className="form-input-header">
        Workspace Description:
          <div
                    className={
                      "char-counter" + (description.length >= 100 ? "-max" : "")
                    }
                  >
                    {" "}
                    {description.length + "/100"}
          </div>
        </div>
      <textarea
                  type="textarea"
                  value={description}
                  minLength={1}
                  maxLength={100}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
      </div> : <div className='ws-form-item'>{currWorkspace.description}</div>}
      {editIcon ? <div className='ws-form-item'>
      <div className="form-input-header">
        Workspace Icon Image Url:
          <div
                    className={
                      "char-counter" + (icon.length >= 100 ? "-max" : "")
                    }
                  >
                    {" "}
                    {icon.length + "/100"}
          </div>
        </div>
      <textarea
                  type="textarea"
                  value={icon}
                  minLength={1}
                  maxLength={100}
                  onChange={(e) => setIcon(e.target.value)}
                  required
                />
      </div> : ""
      }
      {editTitle || editDesc || editIcon ? <div className="ws-form-item-save">

          <div className="ws-update-buttons">
            <div className="ws-update-save" onClick={handleSubmit}>
              Create Workspace
            </div>
            <div className="ws-update-cancel" onClick={cancelCreate}>
              Cancel
            </div>
          </div>

      </div>: ""}
    </div>
  </div>)
};


export default CreateWorkspaceModal;
