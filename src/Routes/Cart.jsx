import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../app-context/cart-context";
import ImageComponent from "../Components/ImageComponent";
import ConfirmDialogComp from "../Components/ConfirmDialogComp";

const Cart = () => {
  const navigate = useNavigate();

  const [total, setTotal] = useState(0);

  const { getCartItems } = useCart();
  const cart = getCartItems();

  const [showModal, setShowModal] = useState(false);
  const [displayMsg, setDisplayMsg] = useState("");
  const [item, setItem] = useState(null);

  useEffect(() => {
    setTotal(
      cart.reduce(
        (accumulator, currentVal) =>
          accumulator + currentVal.qty * currentVal.price,
        0
      )
    );
  }, []);

  const handleOpenModal = (data) => {};

  const handleCloseModal = () => setShowModal(false);

  const handleConfirmAction = () => {
    setShowModal(false);
  };

  return (
    <div className="container">
      <h1 className="mt-4">Shopping Cart</h1>

      {/* only display in md. Never display in mobile view */}
      <div className="d-none d-md-block">
        <div className="row mb-2">
          <div className="col-md-6 col-12"></div>
          <div className="col-md-2 col-4 fw-bold">Qty</div>
          <div className="col-md-2 col-4 fw-bold">Unit Price</div>
          <div className="col-md-2 col-4 fw-bold">Total Price</div>
        </div>
      </div>
      <hr />

      {cart.length > 0 ? (
        cart.map((item) => {
          const { id, title, ItemImages, price, qty } = item;
          return (
            <div key={id}>
              <div className="row mt-4">
                <div className="col-md-6 col-12">
                  <div className="d-flex">
                    <ImageComponent
                      image={ItemImages[0]}
                      width={"100px"}
                      height={"100px"}
                    />
                    <div className="ms-3">
                      <p className="fw-bold mb-1">{title}</p>
                      <button
                        className={`btn btn-sm btn-outline-danger px-3 rounded-pill`}
                        onClick={() => navigate("checkout")}
                      >
                        remove
                      </button>
                    </div>
                  </div>
                </div>

                {/* ONLY DISPLAY ON MOBILE VIEW. FROM md upward never show */}
                <div className="row d-md-none mb-2 mt-2">
                  <div className="col-md-2 col-4">Qty</div>
                  <div className="col-md-2 col-4">Unit Price</div>
                  <div className="col-md-2 col-4">Total Price</div>
                </div>

                <div className="col-md-2 col-4">{qty}</div>
                <div className="col-md-2 col-4">£{price}</div>
                {/* <div className="col-md-2 col-4 fw-bold">£{price * qty}</div> */}
                <div className="col-md-2 col-4 fw-bold">
                  {numeral(price).multiply(4)}
                </div>
              </div>
              <hr />
            </div>
          );
        })
      ) : (
        <div className="row">
          <h3 className="col text-muted">No item in cart</h3>
        </div>
      )}
      {/* 
      <table className="table mx-auto">
        <thead>
          <tr>
            <th style={{ padding: "10px 20px" }} scope="col"></th>
            <th style={{ padding: "10px 20px" }} scope="col"></th>
            <th style={{ padding: "10px 20px" }} scope="col">
              Qty
            </th>
            <th style={{ padding: "10px 20px" }} scope="col">
              Unit Price
            </th>
            <th style={{ padding: "10px 20px" }} scope="col">
              Total Price
            </th>
          </tr>
        </thead>
        <tbody>
          {cart.length > 0 ? (
            cart.map(({ id, title, ItemImages, price, qty }) => {
              return (
                <tr key={id} className="">
                  <td style={{ padding: "20px" }}>
                    <ImageComponent
                      image={ItemImages[0]}
                      width={"100px"}
                      height={"100px"}
                    />
                  </td>
                  <td style={{ padding: "20px" }}>
                    <p className="fw-bold mb-1">{title}</p>
                    <span className="text-danger">remove</span>
                  </td>
                  <td style={{ padding: "20px" }}>{qty}</td>
                  <td style={{ padding: "20px" }}>£{price}</td>
                  <td style={{ padding: "20px" }} className="fw-bold">
                    ${price * qty}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <th colSpan={6}>
                <h3 className="text-muted">No item in cart</h3>
              </th>
            </tr>
          )}
        </tbody>
      </table>
       */}
      <div className="my-3 text-end p-2">
        <div className="text-end">
          <p className="m-0 fs-2">Total</p>
          <span className="fs-4">£{total}</span>
        </div>
        <button
          className={`btn btn-lg btn-outline-danger px-3 rounded-pill ${
            cart.length > 0 ? "" : "disabled"
          }`}
          onClick={() => navigate("checkout")}
        >
          Proceed to Checkout
        </button>
      </div>
      <ConfirmDialogComp
        show={showModal}
        handleClose={handleCloseModal}
        handleConfirm={handleConfirmAction}
        message={displayMsg}
      />
    </div>
  );
};

export default Cart;
