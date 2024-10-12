import React from "react";
import { Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import IMAGES from "../images/images";
import { Link, useNavigate } from "react-router-dom";
import { LuShoppingBag } from "react-icons/lu";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <div className="sticky-top">
      <Navbar
        collapseOnSelect
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
              {/* <Nav.Link> */}
              <Link
                className="navbar-nav nav-item p-2 text-decoration-none nav-link"
                style={{ fontSize: "1.2em", fontVariant: "all-small-caps" }}
                eventKey={"1"}
                to={"/"}
              >
                HOME
              </Link>
              {/* </Nav.Link> */}
              {/* <Nav.Link> */}
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
                  {/* <Link className="text-decoration-none" to={"/product"}> */}
                  <Dropdown.Item onClick={() => navigate("/shop/glasses")}>
                    Glasses
                  </Dropdown.Item>
                  {/* </Link> */}
                  <Dropdown.Item onClick={() => navigate("/shop/belts")}>
                    Belts
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate("/shop/shoes")}>
                    Footwares
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate("/shop/shirts")}>
                    Shirts
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {/* </Nav.Link> */}
              <Link
                className="navbar-nav nav-item p-2 text-decoration-none nav-link"
                style={{ fontSize: "1.2em", fontVariant: "all-small-caps" }}
                eventKey={"3"}
                to={"/shop"}
              >
                SHOP
              </Link>
              <Link
                className="navbar-nav nav-item p-2 text-decoration-none nav-link"
                style={{ fontSize: "1.2em", fontVariant: "all-small-caps" }}
                eventKey={"4"}
                to={"/contact-us"}
              >
                CONTACT US
              </Link>
              <Link
                className="navbar-nav nav-item p-2 text-decoration-none nav-link"
                style={{ fontSize: "1.2em", fontVariant: "all-small-caps" }}
                eventKey={"5"}
                to={"/dashboard"}
              >
                DASHBOARD
              </Link>
            </Nav>
            <Link to={"/cart"}>
              <button type="button" class="btn position-relative p-0">
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  0<span className="visually-hidden">unread messages</span>
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
