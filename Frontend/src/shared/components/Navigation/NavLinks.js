import React from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

import "./NavLinks.css";
import Button from "../FormElements/Button";

const NavLinks = (props) => {
  const context = useContext(AuthContext);
  const url = `/${context.userId}/places`;

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          ALL USERS
        </NavLink>
      </li>
      {context.isLoggedIn && (
        <li>
          <NavLink to={url}>MY PLACES</NavLink>
        </li>
      )}
      {context.isLoggedIn && (
        <li>
          <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>
      )}
      {!context.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {context.isLoggedIn && (
        <li>
          <button onClick={context.logout}>Log Out</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
