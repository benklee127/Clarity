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

export default function Sidebar() {
  const sessionUser = useSelector((state) => state.session.user);
  const allChannels = useSelector((state) => state.channels.allChannels);
  const allUsers = useSelector((state) => state.users.allUsers);
  console.log("user", sessionUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllChannelsThunk());
    dispatch(getAllUsersThunk());
  }, []);
  if (allChannels.length < 1 || allUsers.length < 1) return null;

  const selectChannel = (channel, key) => {
    console.log("selected channel ", channel.id, key);
    if (!key) dispatch(loadChannel(channel));
    else dispatch(selectChatThunk(key));
  };

  console.log("allchannels", allChannels);
  return (
    <div>
      <div className="sidebar-wrapper">
        {/* sidebar Component */}
        <div className="sidebar-channel-section">
          <div>Channel List Header</div>
          Channel List
          {allChannels.map((channel) => {
            console.log("map function run once for ", channel);
            return (
              <button
                className="channel-button"
                key={"ch-button-" + channel.id}
                onClick={() => {
                  selectChannel(channel);
                }}
              >
                {channel.title}
              </button>
            );
          })}
          <OpenModalButton
            buttonText="+"
            modalComponent={<CreateChannelModal type="create" />}
          />
        </div>
        <div className="sidebar-chat-section">
          <div className="sidebar-channel-section">
            <div> Chat List header</div>
            chat list
            {allUsers.map((user) => {
              console.log("map function run once for ", user);
              if (user.id == sessionUser.id) return "";
              let key = "";
              if (sessionUser.id < user.id)
                key = sessionUser.id + "_" + user.id;
              else key = user.id + "_" + sessionUser.id;
              return (
                <button
                  className="channel-button"
                  key={"dm-id-" + user.id}
                  onClick={() => {
                    selectChannel(user, sessionUser.id + "_" + user.id);
                  }}
                >
                  {user.first_name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
