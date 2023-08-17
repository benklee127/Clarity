import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getAllChannelsThunk,
  loadChannel,
  selectChatThunk,
} from "../store/channel";
import OpenModalButton from "./OpenModalButton";
import CreateChannelModal from "./CreateChannelModal";
import LoginFormModal from "./LoginFormModal";
import { getAllUsersThunk } from "../store/user";
import { loadWorkspacesThunk } from "../store/workspace";
import { OpenModalDiv } from "./OpenModalButton";
import CreateWorkspaceModal from "../components/CreateWorkspaceModal"
import UpdateWorkspaceModal from "./UpdateWorkspaceModal";

export default function Sidebar() {
  const sessionUser = useSelector((state) => state.session.user);
  const allChannels = useSelector((state) => state.channels.allChannels);
  const allUsers = useSelector((state) => state.users.allUsers);
  const currChannel = useSelector((state) => state.channels.currChannel);
  const currWorkspace = useSelector((state) => state.workspaces.currWorkspace)
  // console.log("user", sessionUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllChannelsThunk(currWorkspace.id));
    dispatch(getAllUsersThunk());

  }, [currChannel,currWorkspace]);

  if (allChannels.length < 1 || allUsers.length < 1) return null;
  const selectChannel = (channel, key) => {
    // console.log("selected channel ", channel.id, key);
    if (!key) dispatch(loadChannel(channel));
    else dispatch(selectChatThunk(key));
  };

  // console.log("allchannels", allChannels);
  return (

      <div className="sidebar-wrapper">
        {/* sidebar Component */}
        <div className="workspace-bar">
          <div className="workspace-button"><OpenModalDiv
          buttonText=
            {currWorkspace.title}
          modalComponent={
            <UpdateWorkspaceModal
              type="update"

            />
          }
        /> &nbsp;<i class="fa-solid fa-caret-down"></i></div>
        </div>
        <div className="sidebar-channel-section">
          <div className="sidebar-section-header"><i class="fa-solid fa-caret-down"></i>&nbsp;&nbsp;Channels</div>
          {/* Channel List */}
          {allChannels.map((channel) => {
            // console.log("channel type", channel);
            if (channel.chType === "gc") {
              // console.log("map function run once for ", channel);
              return (<div className="create-channel-button">
                  <button

                    key={"ch-button-" + channel.id}
                    onClick={() => {
                      selectChannel(channel);
                    }}
                  >
                    {"#"}   &nbsp;  {channel.title}
                  </button>
                </div>
              );
            } else return "";
          })}
          <div className="create-channel-button">
            <OpenModalButton
              buttonText={"+ Add a Channel"}
              modalComponent={<CreateChannelModal type="create" />}
            />
          </div>
        </div>

        <div className="sidebar-chat-section">
          <div className="sidebar-channel-section">
            <div className="sidebar-section-header"><i class="fa-solid fa-caret-down"></i>&nbsp;&nbsp;Chats</div>
            {allUsers.map((user) => {
              // console.log("map function run once for ", user);
              if (!sessionUser) return "";
              if (user.id == sessionUser.id) return "";
              let key = "";
              // console.log('target: ', user.id, 'curr when sidebarbutton', sessionUser.id);
              if (sessionUser.id < user.id)
                key = sessionUser.id + "_" + user.id;
              else key = user.id + "_" + sessionUser.id;
              return (
                <button
                  className="channel-button"
                  key={"dm-id-" + user.id}
                  onClick={() => {
                    selectChannel(user, key);
                  }}
                >
                  {user.first_name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

  );
}
