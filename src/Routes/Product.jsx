import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { BsArrowRight } from "react-icons/bs";
import styled from "styled-components";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import { useForm } from "react-hook-form";

import { capitalizeFirstLetter } from "../Utils/helpers";
import IMAGES from "../images/images";
import handleErrMsg from "../Utils/error-handler";
import itemController from "../controllers/item-controller";
import ImageComponent from "../Components/ImageComponent";
import EllipsisText from "../Components/EllipsisText";
import { useCart } from "../app-context/cart-context";
import ErrorMessage from "../Components/ErrorMessage";
import ConfirmDialogComp from "../Components/ConfirmDialogComp";

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

const schema = yup.object().shape({
  qty: yup.number().integer().required("Quantity is required"),
});

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [networkRequest, setNetworkRequest] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [displayMsg, setDisplayMsg] = useState("");
  const [qty, setQty] = useState(0);

  const [mainImg, setMainImg] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [item, setItem] = useState(null);
  const [randomItems, setRandomItems] = useState([]);
  const {
    reset,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      qty: 0,
    },
  });

  useEffect(() => {
    initialize();
  }, [id]);

  const initialize = async () => {
    try {
      setNetworkRequest(true);
      setItem(null);
      reset();
      setQty(0);

      const response = await itemController.findById(id);

      //check if the request to fetch item doesn't fail before setting values to display
      if (response && response.data) {
        setItem(response.data);
        setPhotos(response.data.ItemImages);
        setMainImg(response.data.ItemImages[0]);

        const r = await itemController.randomFetchWithCat(
          4,
          response.data.Category.id,
          id
        );
        //check if the request to fetch random items doesn't fail before setting values to display
        if (r && r.data) {
          setRandomItems(r.data);
        }
      }

      setNetworkRequest(false);
    } catch (error) {
      // display error message
      toast.error(handleErrMsg(error).msg);
      setNetworkRequest(false);
    }
  };

  const handleOpenModal = (data) => {
    if (data.qty > 0) {
      const strQty = data.qty > 1 ? "quantities" : "quantity";
      setDisplayMsg(`Add ${data.qty} ${strQty} of ${item.title} to your cart?`);
      setQty(data.qty);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const handleConfirmAction = async () => {
    setShowModal(false);
    const i = { ...item, qty };
    delete i.desc;
    await addToCart(i);
  };

  // display associated images for item
  const imgPhotos = () => {
    return (
      <div
        className="d-flex gap-2 m-2 justify-content-center flex-nowrap"
        style={{ overflowX: "auto" }}
      >
        {photos.map((img) => (
          <div onClick={() => setMainImg(img)} key={Math.random() * new Date()}>
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

  // display skeleton loader for item images
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
    return randomItems.map((randomItem, index) => (
      <div className="" key={Math.random() * new Date() * index}>
        <div
          className="d-flex flex-column justify-content-between border p-3"
          style={{ height: "20rem", minWidth: "10rem" }}
        >
          <small className="poppins">{item.Category.name}</small>
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
                {["glasses", "belts", "footwears", "shirts"].map(
                  (item, index) => (
                    <Link
                      className="text-decoration-none"
                      to={`/shop/${item}`}
                      key={new Date() * index}
                    >
                      <li className="list-group-item list-group-item-action">
                        {capitalizeFirstLetter(item)}
                      </li>
                    </Link>
                  )
                )}
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
                {!item && <Skeleton />}
                {item && (
                  <p>
                    Availability:
                    <span
                      className={`ms-2 ${
                        item.state === true ? "text-primary" : "text-danger"
                      } fw-bold`}
                    >
                      {item.state === true ? "In Stock" : "Out of Stock"}
                    </span>
                  </p>
                )}
              </div>
              <hr />

              <Form>
                <p>
                  {item && item.desc}
                  {!item && <Skeleton />}
                </p>
                <h2 className="p-3 poppins">
                  {item && `£${item.price}`}
                  {!item && <Skeleton />}
                </h2>
                <Form.Group className="my-2 d-flex gap-3">
                  <Form.Control
                    required
                    type="number"
                    className="form-control rounded-pill shadow-sm"
                    style={{ width: "100px" }}
                    {...register("qty")}
                  />
                  <Button
                    type="submit"
                    className={`btn btn-danger rounded-pill ${
                      item === null ? "disabled" : ""
                    }`}
                    onClick={handleSubmit(handleOpenModal)}
                  >
                    Add to Cart
                  </Button>
                </Form.Group>
                <ErrorMessage source={errors.qty} />
              </Form>
              <small>
                Categories: {` `}
                <b>
                  {item && `${item.Category.name}`}
                  {!item && <Skeleton />}
                </b>
              </small>
            </div>

            {/* RELATED PRODUCTS */}
            <div className="border py-4 px-3 rounded-3 mt-3 mb-3">
              <h2>
                <span>Related Products</span>
              </h2>
              <div className="d-flex flex-column flex-md-row gap-2">
                {!networkRequest && createRandomItems()}
                {networkRequest && displayRandomItemsSkeleton()}
                {!networkRequest && randomItems.length === 0 && noItemFound()}
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <ConfirmDialogComp
        show={showModal}
        handleClose={handleCloseModal}
        handleConfirm={handleConfirmAction}
        message={displayMsg}
      />
    </ScrollBar>
  );
};

export default Product;
