import React, { useState } from "react";
import MainHeader from "./MainHeader";
import "./MainNavigation.css";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import BackDrop from "../UIElements/Backdrop";

const MainNavigation = (props) => {
  const [drawerisOpen, setDrawerisOpen] = useState(false);

  const drawerOpenerHandler = () => {
    setDrawerisOpen(true);
  };

  const drawerCloserHandler = () => {
    setDrawerisOpen(false);
  };

  return (
    <>
      {drawerisOpen ? <BackDrop onClick={drawerCloserHandler} /> : null}(
      <SideDrawer show={drawerisOpen} onClick={drawerCloserHandler}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      )
      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={drawerOpenerHandler}
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          {" "}
          <Link to="/">Place Chronicles </Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </>
  );
};

export default MainNavigation;
