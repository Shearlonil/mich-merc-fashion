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
      <h1>Shopping Cart</h1>
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
      <div className="my-3 text-center P-3">
        <div className="text-center">
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
