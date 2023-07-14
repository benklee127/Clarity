import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllChannelsThunk, loadChannel } from "../store/channel";
import OpenModalButton from "./OpenModalButton";
import CreateChannelModal from "./CreateChannelModal";
import LoginFormModal from "./LoginFormModal";

export default function Sidebar() {
  const sessionUser = useSelector((state) => state.session.user);
  const allChannels = useSelector((state) => state.channels.allChannels);
  console.log("user", sessionUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllChannelsThunk());
  }, []);
  if (allChannels.length < 1) return null;

  const selectChannel = (channel) => {
    console.log("selected channel ", channel.id);
    dispatch(loadChannel(channel));
  };

  const createChannel = () => {};

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
            modalComponent={<CreateChannelModal />}
          />
        </div>
        <div className="sidebar-chat-section">Chat List</div>
      </div>
    </div>
  );
}
