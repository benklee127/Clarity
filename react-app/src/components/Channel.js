import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChannelMessages } from "../store/channel";

export default function Channel() {
  const currChannel = useSelector((state) => state.channels.currChannel);
  const channelMessages = useSelector(
    (state) => state.channels.channelMessages
  );
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("useeffect in channel ", currChannel.id);
    dispatch(getChannelMessages(currChannel.id));
  }, [currChannel]);

  if (currChannel == {}) return null;
  return (
    <div className="channel-wrapper">
      Channel Component
      <div className="channel-section">
        <div className="channel-header">
          <div>{currChannel.title}</div>
          <div>{currChannel.description}</div>
        </div>
        <div className="channel-gallery">
          Channel Gallery
          <div className="channel-messages">
            {channelMessages.map((message) => {
              return (
                <div>
                  {message.user.first_name +
                    " " +
                    message.user.last_name +
                    ": "}
                  {message.content}
                </div>
              );
            })}
          </div>
        </div>
        <div className="channel-message">Channel Message Form</div>
      </div>
    </div>
  );
}
