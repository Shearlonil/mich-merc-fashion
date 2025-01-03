import React from "react";
import { FaFacebook } from "react-icons/fa";
import { GrLinkedinOption } from "react-icons/gr";
import { FaLocationDot } from "react-icons/fa6";
import { IoLogoInstagram, IoLogoWhatsapp } from "react-icons/io";
import { FaYahoo } from "react-icons/fa";
import { Link } from "react-router-dom";
import IMAGES from "../images/images";
import { useAuth } from "../app-context/auth-user-context";

const Footer = () => {
  const { getCurrentYear } = useAuth();

  return (
    <div className="bg-light mt-auto" style={{ height: "200px" }}>
      <div className="container">
        <footer className="row border-top border-secondary-subtle py-2">
          <div className="text-center col-12 col-md-4 my-2 mx-auto text-start text-md-center">
            <Link to="/" className="d-flex justify-content-center">
              <img className="" src={IMAGES.logo} alt="logo" width={"100px"} />
            </Link>
            <p className="mb-0">&copy; {getCurrentYear()} Company, Inc</p>
          </div>
          <div className="col-12 col-md-4 text-center d-flex flex-row justify-content-center align-items-center">
            <FaLocationDot size="28" />
            <span className="ms-2">Harptree Drive ME5 OTF</span>
          </div>
          <div className="col-12 col-md-4 align-items-center  justify-content-center d-flex flex-column">
            <ul className="list-unstyled d-flex gap-3  m-0 my-2">
              <li>
                <a
                  className="link-body-emphasis"
                  target="_blank"
                  href="https://wa.me/+447983472603"
                >
                  <IoLogoWhatsapp size="28" />
                </a>
              </li>
              <li>
                <a
                  className="link-body-emphasis"
                  target="_blank"
                  href="https://www.instagram.com/michmercltd20"
                >
                  <IoLogoInstagram size="28" />
                </a>
              </li>
              {/* <li>
                <a
                  className="link-body-emphasis"
                  target="_blank"
                  href="https://www.linkedin.com/in/*"
                >
                  <GrLinkedinOption size="28" />
                </a>
              </li> */}
              <li>
                <a
                  className="link-body-emphasis"
                  target="_blank"
                  href="https://www.facebook.com/Michmercfashionworld.co.uk?sfnsn=scwspwa"
                >
                  <FaFacebook size="28" />
                </a>
              </li>

              <li>
                <a
                  className="link-body-emphasis"
                  target="_blank"
                  href="mailto:michmerclimited@yahoo.com"
                >
                  <FaYahoo size="28" />
                </a>
              </li>
            </ul>
            <ul>
              <a className="link-body-emphasis" href="/terms">
                Terms and Conditions
              </a>
            </ul>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Footer;
