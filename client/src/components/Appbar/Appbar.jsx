import React from "react";

import "./Appbar.css";
import useAuth from "../../util/useAuth.js";
import Button from "../Button/Button";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../Services/authServices.js";
import logo from "../../assets/react.svg";

const Appbar = () => {
  const isLoggedIn = useAuth();
  const navigate = useNavigate();
  return (
    <div className="appbar">
      <div className="appbar__inner">
        <img src={logo} alt="logo" />

        <div className="appbar__menus">
          <NavLink to="/" className={({isActive}) => isActive ? "active" : undefined}>
            Dashboard
          </NavLink>
          <NavLink to="/profile" className={({isActive}) => isActive ? "active" : undefined}>Profile</NavLink>

          {isLoggedIn ? (
            <Button
              label="logout"
              variant="outlined-secondary"
              onClick={() => logout(navigate)}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Appbar;
