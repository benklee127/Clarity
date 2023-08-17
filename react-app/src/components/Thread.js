import "./Home.css";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMessageThunk,
  getChannelMessages,
  updateMessageThunk,
} from "../store/channel";
import { createThreadReplyThunk, getMessageThread } from "../store/thread";
import ThreadReply from "./ThreadReply";

export default function Thread({ showThread, setShowThread, threadId}) {
    const currChannel = useSelector((state) => state.channels.currChannel);
    const sessionUser = useSelector((state) => state.session.user);
    const bottomRef = useRef(null);
    const channelMessages = useSelector(
        (state) => state.channels.channelMessages
      );
    const currThread = useSelector((state) => state.threads.currThread)
    const dispatch = useDispatch()
    const [newContent, setNewContent] = useState("");
    useEffect(()=> {
        // console.log('running get thread dispatch');
        dispatch(getMessageThread(threadId.id))
        // setNewContent("")
    },[showThread, threadId])

    const closeThread = () => {
    setShowThread(true)
    }

    const postReply = async (e) => {
        // console.log('inpostreply');
        if (newContent.length > 0 && threadId) {
            let newReply = {
                content: newContent,
                message_id: threadId.id,
                channel_id: currChannel.id,
            };
            // console.log("new message", newReply);

            const data = await dispatch(createThreadReplyThunk(newReply));

        }
    }
    return <div className="thread-wrapper">

        <div className="channel-header">

        <div className="channel-header-wrapper">

            <div className="ch-header-section">

                <div className='ch-title'>Thread </div>
                <div className="ch-desc">
                      {" "}
                      {"# "}
                      {currChannel.title}
                </div>

            </div>
            <div className='close-thread' onClick={closeThread}><i class="fa-solid fa-x"></i></div>
        </div>
        <div className="thread-gallery">

            {currThread.length > 0 ? currThread.map((reply) =>{
                return <ThreadReply reply={reply} />
            }
            ): ""}

            <div className="channel-message">

                <div className="message-form" >
                    <textarea
                    className="message-form-content"
                    type="textarea"
                    value={newContent}
                    minLength={1}
                    maxLength={500}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder={"Reply in Thread"}
                    >

                    </textarea>
                    <div className="form-bot-banner">
                    <div
                        className={
                        "char-counter" + (newContent.length >= 500 ? "-max" : "")
                        }
                    >
                        {" "}
                        { newContent.length + "/500"}
                    </div>
                    <button type="submit" onClick={postReply} className="message-form-button">
                        <div className="ch-title">
                        &nbsp;
                        <i class="fa-solid fa-paper-plane">&nbsp;</i>&nbsp;
                        </div>
                    </button>
                    </div>
                </div>
            </div>
        </div>

        </div>
    </div>
//     return (<div className="channel-messages">
//     {currChannel && channelMessages && channelMessages.length > 0 ? (
//       channelMessages.map((message) => {
//         return <Message message={message} showThread={showThread} setShowThread={setShowThread}/>;
//       })
//     ) : currChannel.id ? (
//       <div className="channel-help">
//         Be the first to send a message!
//       </div>
//     ) : (
//       <div className="channel-help">
//         Select a channel to get started!
//       </div>
//     )}
//     <div ref={bottomRef} />
//   </div>)
}
