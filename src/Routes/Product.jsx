import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { BsArrowRight } from "react-icons/bs";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";

import { capitalizeFirstLetter } from "../Utils/helpers";
import IMAGES from "../images/images";
import handleErrMsg from "../Utils/error-handler";
import genericController from "../controllers/generic-controller";
import ImageComponent from "../Components/ImageComponent";

const ScrollBar = styled.div`
  ::-webkit-scrollbar {
    width: 50%;
    height: 10px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #a0a0a0;
    border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #a85353;
  }
`;

const Product = () => {
  const { id } = useParams();
  const [networkRequest, setNetworkRequest] = useState(false);

  const [mainImg, setMainImg] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [item, setItem] = useState(null);
  const [randomItems, setRandomItems] = useState([]);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      setNetworkRequest(true);
      const urls = [`/items/find/${id}`, `/items/random/${5}`];
      const response = await genericController.performGetRequests(urls);
      const { 0: item, 1: randomItems } = response;

      //check if the request to fetch item doesn't fail before setting values to display
      if (item && item.data) {
        setItem(item.data);
        setPhotos(item.data.ItemImages);
        setMainImg(item.data.ItemImages[0]);
      }

      //check if the request to fetch random items doesn't fail before setting values to display
      if (randomItems && randomItems.data) {
        setRandomItems(randomItems.data);
      }

      setNetworkRequest(false);
    } catch (error) {
      // display error message
      toast.error(handleErrMsg(error).msg);
      setNetworkRequest(false);
    }
  };

  const imgPhotos = () => {
    return (
      <div
        className="d-flex gap-2 m-2 justify-content-center flex-nowrap"
        style={{ overflowX: "auto" }}
      >
        {photos.map((img, index) => (
          <div onClick={() => setMainImg(img)}>
            <ImageComponent
              image={img}
              key={Math.random()}
              width={60}
              height={60}
            />
          </div>
        ))}
      </div>
    );
  };

  const imgPhotosSkeleton = () => {
    return (
      <div
        className="d-flex gap-2 justify-content-center flex-nowrap"
        style={{ overflowX: "auto" }}
      >
        {new Array(4).fill(1).map((index) => (
          <Skeleton count={1} key={Math.random()} width={70} height={60} />
        ))}
      </div>
    );
  };

  const createRandomItems = () => {
    return randomItems.map((item, index) => (
      <div className="">
        <div
          className="d-flex flex-column justify-content-between border p-3"
          style={{ height: "20rem", minWidth: "10rem" }}
        >
          <small className="poppins">Sneakers</small>
          <h5 className="text-nowrap fw-normal">{item.title}</h5>
          <img
            src={IMAGES.shoe5}
            style={{ maxWidth: "100%", width: "300px", height: 130 }}
            alt=""
          />
          <div className="d-flex justify-content-between">
            <p className="m-0">£{item.price}</p>
            <button className="d-flex align-item-center justify-content-center btn btn-outline-dark py-1 px-2 rounded-circle">
              <BsArrowRight />
            </button>
          </div>
        </div>
      </div>
    ));
  };

  const noItemFound = () => {
    return (
      <div className="">
        <div
          className="d-flex flex-column justify-content-between border p-3"
          style={{ height: "20rem", minWidth: "10rem" }}
        >
          <small className="poppins">Not Found</small>
          <h5 className="text-nowrap fw-normal">No Item</h5>
          <img
            src={IMAGES.logo}
            style={{ maxWidth: "100%", width: "300px", height: 130 }}
            alt=""
          />
          <div className="d-flex justify-content-between">
            <p className="m-0">£0.00</p>
            <button className="d-flex align-item-center justify-content-center btn disabled btn-outline-dark py-1 px-2 rounded-circle">
              <BsArrowRight />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ScrollBar>
      <div className="bg-danger" style={{ height: "50px" }}></div>
      <div className="container">
        <Row>
          <Col className="d-none d-md-block" xs="12" md="3">
            <div id="categories">
              <p className="link border border-bottom-1 border-top-0 border-start-0 border-end-0 my-3 p-2 fw-bold">
                Categories
              </p>
              <ul className="list-group">
                {["glasses", "belts", "footwears", "shirts"].map((item) => (
                  <Link className="text-decoration-none" to={`/shop/${item}`}>
                    <li className="list-group-item list-group-item-action">
                      {capitalizeFirstLetter(item)}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          </Col>

          <Col className="row" xs="12" md="9">
            <div className="col-12 col-md-5 p-4 my-2">
              {item && <ImageComponent image={mainImg} height={300} />}
              {item && imgPhotos()}
              {!item && <Skeleton height={300} />}
              {!item && imgPhotosSkeleton()}
            </div>
            <div className="col-12 col-md-7">
              <div className="py-4 mt-3">
                <h2>
                  {item && item.title}
                  {!item && <Skeleton />}
                </h2>
                <p>
                  Availability:
                  <span className="text-danger fw-bold">Out of Stock</span>
                </p>
              </div>
              <hr />

              <div>
                <p>
                  {item && item.desc}
                  {!item && <Skeleton />}
                </p>
                <h2 className="p-3 poppins">
                  {item && `£${item.price}`}
                  {!item && <Skeleton />}
                </h2>
                <div className="my-2 d-flex gap-3">
                  <input
                    type="number"
                    placeholder="0"
                    className="form-control rounded-pill shadow-sm"
                    style={{ width: "100px" }}
                  />
                  <button className="btn btn-danger rounded-pill">
                    Add to Cart
                  </button>
                </div>
                <small>
                  Categories: {` `}
                  <b>
                    {item && `${item.Category.name}`}
                    {!item && <Skeleton />}
                  </b>
                </small>
              </div>
            </div>

            {/* RELATED PRODUCTS */}
            <div className="border py-4 px-3 rounded-3 mt-3 mb-3">
              <h2>
                <span>Related Products</span>
              </h2>
              <div className="d-flex flex-column flex-md-row gap-2">
                {item && createRandomItems()}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </ScrollBar>
  );
};

export default Product;
