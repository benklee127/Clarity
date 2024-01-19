import Sidebar from "./Sidebar";
import Channel from "./Channel";
import WorkspaceBar from "./WorkspaceBar";
import "./Home.css";
import { useSelector } from "react-redux";
import Navigation from "./Navigation";
import OpenModalButton from "./OpenModalButton";
import LoginFormModal from "./LoginFormModal";
import { logout } from "../store/session";
import { useDispatch } from "react-redux";
import SignupFormModal from "./SignupFormModal";
import { login } from "../store/session";
import homebackground from "../assets/homebackground.png";
import { useEffect } from "react";
import { getUserWorkspacesThunk, getWorkspacesThunk, joinWorkspaceThunk } from "../store/workspace";
import { getAllChannelsThunk } from "../store/channel";
import JoinChannelPage from "./JoinChannelPage";
import { useState } from "react";

export default function Home({ isLoaded }) {
  const currentUser = useSelector((state) => state.session.user);
  const currChannel = useSelector((state) => state.channels.currChannel);
  const userWorkspaces = useSelector((state) => state.workspaces.userWorkspaces);
  const allWorkspaces = useSelector((state) => state.workspaces.allWorkspaces);
  const [showJoinChannel, setShowJoinChannel] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  useEffect(() => {
    dispatch(getUserWorkspacesThunk())
    dispatch(getWorkspacesThunk())
  }, [dispatch,currentUser])

  const joinWorkspace = (id) => {
    dispatch(joinWorkspaceThunk(id));
    dispatch(getUserWorkspacesThunk());
    setShowJoinChannel(false);
  }

  const demoUser = () => {
    return dispatch(login("demo@aa.io", "password"));
  };
  if (allWorkspaces.length < 1) return null;
  // if(userWorkspaces.length < 1) setShowJoinChannel(true);

  if (currentUser ) {
    console.log('deployment error testt message 1');
    return (
      <div className="home-wrapper">
        <Navigation isLoaded={isLoaded} />
        { userWorkspaces.length < 1 || showJoinChannel ?
        <JoinChannelPage showJoinChannel={showJoinChannel} setShowJoinChannel={setShowJoinChannel}/>
        :<div className="main-wrapper">
          {/* {showJoinChannel ? "true" + userWorkspaces.length: "false"} */}
          <WorkspaceBar showJoinChannel={showJoinChannel} setShowJoinChannel={setShowJoinChannel}/>
          <Sidebar />
          <Channel currChannelProp={currChannel} />
        </div>


        }

      </div>
    );
  } else {
    console.log('deployment error test message 4');
    return (
      <div className="dh-wrapper">
        <div className="dh-topbar">
          <i class="fa-brands fa-strava"> </i>&nbsp; Sign in | Clarity
        </div>

        <div className="dh-main-wrapper">
          <div className="dh-main">
            <div>
              <i class="fa-brands fa-strava"></i> Clarity
            </div>
            <div>Clarity brings the team together wherever you are</div>
            <OpenModalButton
              buttonText="Sign in to Clarity"
              modalComponent={<LoginFormModal />}
            />
            <OpenModalButton
              buttonText="Create an account"
              modalComponent={<SignupFormModal />}
            />
            <button onClick={demoUser}>Demo user</button>
          </div>
          <div className="dh-main-image">
            <img src={homebackground} className="homebackground" />
          </div>
        </div>
      </div>
    );
  }
}
