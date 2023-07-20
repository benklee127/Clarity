import Sidebar from "./Sidebar";
import Channel from "./Channel";
import Navbar from "./Navbar";
import "./Home.css";
import { useSelector } from "react-redux";
import Navigation from "./Navigation";
import OpenModalButton from "./OpenModalButton";
import LoginFormModal from "./LoginFormModal";
import { logout } from "../store/session";
import { useDispatch } from "react-redux";
import SignupFormModal from "./SignupFormModal";
import { login  } from "../store/session";

export default function Home({ isLoaded }) {
  const currentUser = useSelector((state) => state.session.user);
  const currChannel = useSelector((state) => state.channels.currChannel);
  const dispatch = useDispatch();

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  const demoUser = () => {
    return dispatch(login("demo@aa.io", "password"));
  };

  if (currentUser) {
    return (
      <div className="home-wrapper">
        <Navigation isLoaded={isLoaded} />
        <div className="main-wrapper">
          <Sidebar />
          <Channel currChannelProp={currChannel} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="dh-wrapper">
        <div className="dh-topbar">Sign in | Clarity</div>
        <div className="dh-main-wrapper">
          <div className="dh-main">
            <div>
              <i class="fa-solid fa-user-astronaut"></i> Clarity
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
          <div className="dh-main-image">background image</div>
        </div>
      </div>
    );
  }
}
