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
import { getUserWorkspacesThunk, getWorkspacesThunk } from "../store/workspace";
import { getAllChannelsThunk } from "../store/channel";


export default function Home({ isLoaded }) {
  const currentUser = useSelector((state) => state.session.user);
  const currChannel = useSelector((state) => state.channels.currChannel);
  const userWorkspaces = useSelector((state) => state.workspaces.userWorkspaces);
  const allWorkspaces = useSelector((state) => state.workspaces.allWorkspaces);
  const dispatch = useDispatch();

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  useEffect(() => {
    dispatch(getUserWorkspacesThunk())
    dispatch(getWorkspacesThunk())
  }, [dispatch,currentUser])

  const demoUser = () => {
    return dispatch(login("demo@aa.io", "password"));
  };
  if (allWorkspaces.length < 1) return null;
  if (currentUser ) {
    return (
      <div className="home-wrapper">
        <Navigation isLoaded={isLoaded} />
        { userWorkspaces.length > 0 ?       <div className="main-wrapper">
          <WorkspaceBar />
          <Sidebar />
          <Channel currChannelProp={currChannel} />
        </div> :
        <div className='join-workspace-page'>
          <div className='join-workspace-brand'>
            Clarity
          </div>
          <div className='join-workspace-cta'>
            Choose a workspace
          </div>
          <div className='join-workspace-list'>
            <div className='join-workspace-list-header'>Workspaces available</div>
            {allWorkspaces.map((workspace) => {
              console.log('test  run', workspace);
              return (<div className='join-workspace-button'>
                <div className='join-workspace-img'><img src={workspace.icon}/></div>
                <div className='join-workspace-button-info'>
                  <div className='join-ws-title'>{workspace.title}</div>
                  {/* <div className='join-ws-members'></div> */}
                </div>
              </div>)
            })}
            <div className='join-workspace-button'>
              Create a workspace
            </div>
            </div>
        </div>
        }

      </div>
    );
  } else {
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
