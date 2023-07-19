import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./Navigation/ProfileButton";
// import "./Navigation.css";

export default function Navbar({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  console.log("herehere");
  return (
    <div className="navbar-wrapper">
      Navbar Component
      {/* <ul>
        <li>
          <NavLink exact to="/">
            Home
          </NavLink>
        </li>
        {isLoaded && (
          <li>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul> */}
    </div>
  );
}
