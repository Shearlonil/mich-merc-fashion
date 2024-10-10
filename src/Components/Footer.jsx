import React from "react";
import { FaFacebook } from "react-icons/fa";
import { GrLinkedinOption } from "react-icons/gr";
import { IoLogoInstagram, IoLogoWhatsapp } from "react-icons/io";
import { SiGmail } from "react-icons/si";
import { Link } from "react-router-dom";
import IMAGES from "../images/images";

const Footer = () => {
  return (
    <div className="bg-light mt-auto" style={{ height: "200px" }}>
      <div className="container">
        <footer className="row border-top border-secondary-subtle py-2">
          <div className="text-center col-12 col-md-4 my-2 mx-auto text-start text-md-center">
            <Link to="/" className="d-flex justify-content-center">
              <img className="" src={IMAGES.logo} alt="logo" width={"100px"} />
            </Link>
            <p className="mb-0">&copy; 2024 Company, Inc</p>
          </div>
          <div className="col-12 col-md-4 text-center d-flex flex-column justify-content-center align-items-center">
            <p>
              Address here... LOREM ipsum dolor sit amet consectetur adipisicing
              elit. Ducimus, error?
            </p>
          </div>
          <ul class="col-12 col-md-4 list-unstyled d-flex justify-content-center gap-3 align-items-center m-0 my-2">
            <li>
              <a
                class="link-body-emphasis"
                target="_blank"
                href="https://wa.me/"
              >
                <IoLogoWhatsapp size="28" />
              </a>
            </li>
            <li>
              <a
                class="link-body-emphasis"
                target="_blank"
                href="https://www.instagram.com/*"
              >
                <IoLogoInstagram size="28" />
              </a>
            </li>
            <li>
              <a
                class="link-body-emphasis"
                target="_blank"
                href="https://www.linkedin.com/in/*"
              >
                <GrLinkedinOption size="28" />
              </a>
            </li>
            <li>
              <a
                class="link-body-emphasis"
                target="_blank"
                href="https://www.facebook.com/*"
              >
                <FaFacebook size="28" />
              </a>
            </li>

            <li>
              <a
                class="link-body-emphasis"
                target="_blank"
                href="mailto:admin@hello.com"
              >
                <SiGmail size="28" />
              </a>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  );
};

export default Footer;
