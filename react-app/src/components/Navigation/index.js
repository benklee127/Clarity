import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const currChannel = useSelector((state) => state.channels.currChannel);

  return (
    <div className="navbar-wrapper">
      <div className="home-topbar">
        <i class="fa-brands fa-strava"> </i>&nbsp;Clarity
      </div>
      <div className="prof-button-wrapper">
        {<ProfileButton user={sessionUser} />}
      </div>
    </div>
  );
}

export default Navigation;
