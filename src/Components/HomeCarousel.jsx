import React from "react";
import Carousel from "react-bootstrap/Carousel";
import IMAGES from "../images/images";
import { Link } from "react-router-dom";

const HomeCarousel = () => {
  return (
    <div>
      <Carousel className="py-5 py-sm-3" indicators={false}>
        <Carousel.Item style={{ height: "500px" }}>
          <div className="row h-100">
            <div className="col-12 col-sm-6 text-center d-flex flex-column align-items-center justify-content-center">
              <h1 className=" text">RUNNING SHOES</h1>
              <p>Get up to 50% off Today Only</p>
              <Link
                to={"/shop"}
                className="btn btn-danger btn-lg px-4 rounded-0 "
              >
                SHOP NOW
              </Link>
            </div>
            <div className="col-12 col-sm-6 my-auto">
              <img
                src={IMAGES.shoe7}
                width={"100%"}
                height="400px"
                className="d-block w-100"
                alt="..."
              />
            </div>
          </div>
        </Carousel.Item>
        <Carousel.Item style={{ height: "500px" }}>
          <div className="row h-100">
            <div className="col-12 col-sm-6 text-center d-flex flex-column align-items-center justify-content-center">
              <h1 className="">MEN'S SHIRT</h1>
              <p>Get up to 50% off Today Only</p>
              <Link
                to={"/shop"}
                className="btn btn-danger btn-lg px-4 rounded-0 "
              >
                SHOP NOW
              </Link>
            </div>
            <div className="col-12 col-sm-6 my-auto">
              <img
                src={IMAGES.shirt1}
                width={"100%"}
                height="400px"
                className="d-block w-100"
                alt="..."
              />
            </div>
          </div>
        </Carousel.Item>
        <Carousel.Item style={{ height: "500px" }}>
          <div className="row h-100">
            <div className="col-12 col-sm-6 text-center d-flex flex-column align-items-center justify-content-center">
              <h1 className="">BROWN LEATHER SHOES</h1>
              <p>Get up to 50% off Today Only</p>
              <Link
                to={"/shop"}
                className="btn btn-danger btn-lg px-4 rounded-0 "
              >
                SHOP NOW
              </Link>
            </div>
            <div className="col-12 col-sm-6 my-auto">
              <img
                src={IMAGES.shoe1}
                width={"100%"}
                height="400px"
                className="d-block w-100"
                alt="..."
              />
            </div>
          </div>
        </Carousel.Item>
        <Carousel.Item style={{ height: "500px" }}>
          <div className="row h-100">
            <div className="col-12 col-sm-6 text-center d-flex flex-column align-items-center justify-content-center">
              <h1 className="">GLASSES</h1>
              <p>Get up to 50% off Today Only</p>
              <Link
                to={"/shop"}
                className="btn btn-danger btn-lg px-4 rounded-0 "
              >
                SHOP NOW
              </Link>
            </div>
            <div className="col-12 col-sm-6 my-auto">
              <img
                src={IMAGES.glasses6}
                width={"100%"}
                height="400px"
                className="d-block w-100"
                alt="..."
              />
            </div>
          </div>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default HomeCarousel;
