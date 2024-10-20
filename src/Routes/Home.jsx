import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";

import IMAGES from "../images/images";
import HomeCarousel from "../Components/HomeCarousel";
import handleErrMsg from "../Utils/error-handler";
import EllipsisText from "../Components/EllipsisText";
import ImageComponent from "../Components/ImageComponent";
import itemController from "../controllers/item-controller";

const Home = () => {
  const navigate = useNavigate();

  const [randomItems, setRandomItems] = useState([]);
  const [networkRequest, setNetworkRequest] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      setNetworkRequest(true);
      const response = await itemController.random(5);

      //check if the request to fetch item doesn't fail before setting values to display
      if (response && response.data) {
        setRandomItems(response.data);
      }

      setNetworkRequest(false);
    } catch (error) {
      // display error message
      toast.error(handleErrMsg(error).msg);
      setNetworkRequest(false);
    }
  };

  const createRandomItems = () => {
    return randomItems.map((randomItem, index) => (
      <div className="" key={Math.random() * new Date() * index}>
        <div
          className="d-flex flex-column justify-content-between border p-3"
          style={{ height: "20rem", minWidth: "10rem" }}
        >
          <small className="poppins">{randomItem.name}</small>
          <h5 className="fw-normal">
            <EllipsisText
              styles={{ style: { fontFamily: "Abril Fatface" } }}
              message={randomItem.title}
              maxLength={10}
              clickable={false}
            />
          </h5>
          <ImageComponent image={randomItem.img} height={130} />
          <div className="d-flex justify-content-between">
            <p className="m-0">£{randomItem.price}</p>
            <button
              onClick={() => navigate(`/product/${randomItem.id}`)}
              className="d-flex align-item-center justify-content-center btn btn-outline-dark py-1 px-2 rounded-circle"
            >
              <BsArrowRight />
            </button>
          </div>
        </div>
      </div>
    ));
  };

  const displayRandomItemsSkeleton = () => {
    {
      return new Array(4).fill(1).map((index) => (
        <div className="" key={Math.random() * new Date() * index}>
          <div
            className="d-flex flex-column justify-content-between border p-3"
            style={{ height: "20rem", minWidth: "10rem" }}
          >
            <small className="poppins">
              <Skeleton count={1} />
            </small>
            <h5 className="text-nowrap fw-normal">
              <Skeleton count={1} />
            </h5>
            <Skeleton
              count={1}
              key={Math.random()}
              height={130}
              width={"160px"}
            />
            <div className="d-flex justify-content-between">
              <p className="m-0">
                <Skeleton count={1} width={30} />
              </p>
            </div>
          </div>
        </div>
      ));
    }
  };

  return (
    <>
      <div className="container-fluid bg-light">
        <div className="container">
          <HomeCarousel />
        </div>
        <div className="container my-4">
          <div className="container text-center my-3 py-3" id="showcase-1">
            <h1 className="">Top Categories</h1>
            <p>Quick select from a list of available top categories</p>
          </div>
          <div className="row">
            <div className="col-12 col-md-6 p-2">
              <div
                className="d-flex gap-3 bg-danger-subtle p-4 rounded align-items-center"
                style={{ height: "270px" }}
              >
                <div>
                  <span>Top Pick</span>
                  <h1 className="display-5 ">Glasses</h1>
                  <small>
                    <Link
                      to={"/shop/glasses"}
                      className="link link-danger"
                      href="#"
                    >
                      View Collection
                    </Link>
                  </small>
                </div>
                <div>
                  <img
                    src={IMAGES.glasses11}
                    width={"100%"}
                    className="img-fluid"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 p-2">
              <div
                className="d-flex gap-3 bg-info-subtle p-4 rounded align-items-center"
                style={{ height: "270px" }}
              >
                <div>
                  <span>Top Pick</span>
                  <h1 className="display-5 ">Footwears</h1>
                  <small>
                    <Link
                      to={"/shop/footwears"}
                      className="link link-danger"
                      href="#"
                    >
                      View Collection
                    </Link>
                  </small>
                </div>
                <div>
                  <img
                    src={IMAGES.shoe1}
                    width={"100%"}
                    className="img-fluid"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 p-2">
              <div
                className="d-flex gap-3 bg-success-subtle p-4 rounded align-items-center"
                style={{ height: "270px" }}
              >
                <div>
                  <span>Top Pick</span>
                  <h1 className="display-5 ">Belts</h1>
                  <small>
                    <Link
                      to={"/shop/belts"}
                      className="link link-danger"
                      href="#"
                    >
                      View Collection
                    </Link>
                  </small>
                </div>
                <div>
                  <img
                    src={IMAGES.belt1}
                    width={"100%"}
                    className="img-fluid"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 p-2">
              <div
                className="d-flex gap-3 bg-warning-subtle p-4 rounded align-items-center"
                style={{ height: "270px" }}
              >
                <div>
                  <span>Top Pick</span>
                  <h1 className="display-5 ">Shirts</h1>
                  <small>
                    <Link
                      to={"/shop/shirts"}
                      className="link link-danger"
                      href="#"
                    >
                      View Collection
                    </Link>
                  </small>
                </div>
                <div>
                  <img
                    src={IMAGES.shirt1}
                    width={"100%"}
                    className="img-fluid"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mt-5">
          <h1 className="display-5 text-center">Recommended Products</h1>
          <div className="d-flex flex-column flex-md-row gap-2 mb-4 mt-4 justify-content-center">
            {!networkRequest && createRandomItems()}
            {networkRequest && displayRandomItemsSkeleton()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
