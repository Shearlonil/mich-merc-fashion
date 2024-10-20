import React, { useState } from "react";
import { Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import IMAGES from "../images/images";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LuShoppingBag } from "react-icons/lu";
import { useAuth } from "../app-context/auth-user-context";
import { useCart } from "../app-context/cart-context";
import handleErrMsg from "../Utils/error-handler";

const NavBar = () => {
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(false);

  const { authUser, logout } = useAuth();
  const user = authUser();
  const { count } = useCart();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleNavSelect = () => {
    setExpanded(false); // Close the navbar on selection (for mobile)
  };

  const handleLogout = async () => {
    // call logout endpoint
    try {
      setIsLoggingOut(true);
      await logout();
      setIsLoggingOut(false);
    } catch (error) {
      // display error message
      toast.error(handleErrMsg(error).msg);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="sticky-top">
      <Navbar
        collapseOnSelect
        expanded={expanded}
        onToggle={handleToggle}
        expand="md"
        className="navbar-light bg-light m-0 text-center"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <Container>
          <Navbar.Brand className="">
            <Link to={"/"}>
              <img src={IMAGES.logo} width={"70px"} alt="" />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav text-center">
            <Nav className="mx-auto gap-0 gap-md-3">
              <Link
                className="navbar-nav nav-item p-2 text-decoration-none nav-link"
                style={{ fontSize: "1.2em", fontVariant: "all-small-caps" }}
                to={"/"}
                onClick={handleNavSelect}
              >
                HOME
              </Link>

              <Dropdown className="mx-auto">
                <Dropdown.Toggle
                  className="text-decoration-none nav-link"
                  variant="transparent"
                  id="dropdown-basic"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "1.17em",
                    fontVariant: "all-small-caps",
                  }}
                >
                  Categories
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => {
                      navigate("/shop/glasses");
                      onClick = { handleNavSelect };
                    }}
                  >
                    Glasses
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      navigate("/shop/belts");
                      onClick = { handleNavSelect };
                    }}
                  >
                    Belts
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      navigate("/shop/footwears");
                      onClick = { handleNavSelect };
                    }}
                  >
                    Footwares
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      navigate("/shop/shirts");
                      onClick = { handleNavSelect };
                    }}
                  >
                    Shirts
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Link
                className="navbar-nav nav-item p-2 text-decoration-none nav-link"
                style={{ fontSize: "1.2em", fontVariant: "all-small-caps" }}
                to={"/shop"}
                onClick={handleNavSelect}
              >
                SHOP
              </Link>
              <Link
                className="navbar-nav nav-item p-2 text-decoration-none nav-link"
                style={{ fontSize: "1.2em", fontVariant: "all-small-caps" }}
                to={"/contact-us"}
                onClick={handleNavSelect}
              >
                CONTACT US
              </Link>
              <Link
                className="navbar-nav nav-item p-2 text-decoration-none nav-link"
                style={{ fontSize: "1.2em", fontVariant: "all-small-caps" }}
                to={"/dashboard"}
                onClick={handleNavSelect}
              >
                DASHBOARD
              </Link>
            </Nav>
            <Link to={"/cart"} onClick={handleNavSelect}>
              <button type="button" className="btn position-relative p-0">
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {count()}
                  <span className="visually-hidden">shopping cart items</span>
                </span>
                <LuShoppingBag size={30} />
              </button>
            </Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
