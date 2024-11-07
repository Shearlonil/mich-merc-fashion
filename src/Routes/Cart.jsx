import React, { useEffect, useState } from "react";
import numeral from "numeral";
import { MdAdd } from "react-icons/md";
import { MdRemove } from "react-icons/md";
import { toast } from "react-toastify";

import { useCart } from "../app-context/cart-context";
import ImageComponent from "../Components/ImageComponent";
import ConfirmDialogComp from "../Components/ConfirmDialogComp";
import purchaseController from "../controllers/purchase-controller";
import handleErrMsg from "../Utils/error-handler";
import { OribitalLoading } from "../Components/react-loading-indicators/Indicator";

const Cart = () => {
  const [networkRequest, setNetworkRequest] = useState(false);

  const [total, setTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  // for controlling the increment and decrement buttons while updating cart
  const [updating, setUpdating] = useState(false);

  const { getCartItems, getToken, updateCart, removeFromCart, clear } =
    useCart();

  const [showModal, setShowModal] = useState(false);
  const [displayMsg, setDisplayMsg] = useState("");
  const [removedCartItem, setRemovedCartItem] = useState(null);

  useEffect(() => {
    initialize();
  }, [getCartItems]);

  const initialize = async () => {
    try {
      const items = await getCartItems();
      setCartItems(items);
      setTotal(
        items.reduce(
          (accumulator, currentVal) =>
            numeral(currentVal.qty)
              .multiply(currentVal.salesPrice)
              .add(accumulator)
              .value(),
          0
        )
      );
    } catch (error) {
      // do nothing
    }
  };

  const handleOpenModal = (data) => {
    if (data) {
      setDisplayMsg(`Remove item ${data.title} from your cart?`);
      setRemovedCartItem(data);
      setShowModal(true);
    } else {
      setDisplayMsg(`Clear shopping cart?`);
      setRemovedCartItem();
      setShowModal(true);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const handleConfirmAction = async () => {
    setShowModal(false);
    if (removedCartItem) {
      try {
        await removeFromCart(removedCartItem);
        setTotal(
          await getCartItems().reduce(
            (accumulator, currentVal) =>
              numeral(currentVal.qty)
                .multiply(currentVal.salesPrice)
                .add(accumulator)
                .value(),
            0
          )
        );
        setCartItems(await getCartItems());
      } catch (error) {
        toast.error("Stale Cart");
        // clear cart
        clear();
        setCartItems([]);
        setTotal(0);
      }
    } else {
      // clear button clicked
      clear();
      setCartItems([]);
      setTotal(0);
    }
  };

  const increment = async (data) => {
    try {
      setUpdating(true);
      data.qty++;
      await updateCart(data);
      const items = await getCartItems();
      setTotal(
        items.reduce(
          (accumulator, currentVal) =>
            numeral(currentVal.qty)
              .multiply(currentVal.salesPrice)
              .add(accumulator)
              .value(),
          0
        )
      );
      setCartItems(items);
      setUpdating(false);
    } catch (error) {
      toast.error("Stale Cart");
      setUpdating(false);
      // clear cart
      clear();
      setCartItems([]);
      setTotal(0);
    }
  };

  const decrement = async (data) => {
    try {
      if (data.qty > 1) {
        setUpdating(true);
        data.qty--;
        await updateCart(data);
        const items = await getCartItems();
        setTotal(
          items.reduce(
            (accumulator, currentVal) =>
              numeral(currentVal.qty)
                .multiply(currentVal.salesPrice)
                .add(accumulator)
                .value(),
            0
          )
        );
        setCartItems(items);
        setUpdating(false);
      }
    } catch (error) {
      toast.error("Stale Cart");
      setUpdating(false);
      // clear cart
      clear();
      setCartItems([]);
      setTotal(0);
    }
  };

  const createCheckoutSession = async () => {
    try {
      setNetworkRequest(true);
      const response = await purchaseController.checkout({ cart: getToken() });

      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      toast.error(handleErrMsg(error).msg);
      setNetworkRequest(false);
    }
  };

  return (
    <div className="container">
      <h1 className="mt-4">
        Shopping{" "}
        <span className="text-primary" style={{ fontFamily: "Abril Fatface" }}>
          Cart
        </span>
      </h1>

      {/* only display in md. Never display in mobile view */}
      <div className="d-none d-md-block mt-4">
        <div className="row mb-2">
          <div className="col-md-6 col-12 fw-bold">Product</div>
          <div className="col-md-2 col-4 fw-bold">Qty</div>
          <div className="col-md-2 col-4 fw-bold">Unit Price</div>
          <div className="col-md-2 col-4 fw-bold">Total Price</div>
        </div>
      </div>
      <hr />

      {cartItems.length > 0 ? (
        cartItems.map((item) => {
          const { id, title, ItemImages, salesPrice, qty } = item;
          return (
            <div key={qty * id}>
              <div className="row mt-4">
                <div className="col-md-6 col-12">
                  <div className="d-flex">
                    <ImageComponent
                      image={ItemImages}
                      width={"100px"}
                      height={"100px"}
                    />
                    <div className="ms-3">
                      <p className="fw-bold mb-2">{title}</p>
                      <button
                        className={`btn btn-sm btn-outline-danger px-3 rounded-pill`}
                        onClick={() => handleOpenModal(item)}
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

                <div className="col-md-2 col-4">
                  <span
                    onClick={() => increment(item)}
                    className={`btn btn-outline-dark py-1 px-2 rounded-circle ${
                      updating ? "disabled" : ""
                    }`}
                  >
                    <MdAdd />
                  </span>
                  <span className="ms-2 me-2">{qty}</span>
                  <button
                    onClick={() => decrement(item)}
                    className={`btn btn-outline-danger py-1 px-2 rounded-circle ${
                      updating ? "disabled" : ""
                    }`}
                  >
                    <MdRemove />
                  </button>
                </div>
                <div className="col-md-2 col-4">£{salesPrice}</div>
                <div className="col-md-2 col-4 fw-bold">
                  {numeral(item.qty)
                    .multiply(item.salesPrice)
                    .format("£0,0.00")}
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
      <div className="my-3 text-end p-2">
        <div className="text-end">
          <p className="m-0 fs-2">Total</p>
          <span className="fs-4">{numeral(total).format("£0,0.00")}</span>
        </div>
        <div className="d-flex gap-4 justify-content-end">
          <button
            className={`btn btn-sm btn-outline-danger px-3 rounded-pill ${
              cartItems.length > 0 ? "" : "disabled"
            } ${networkRequest ? "disabled" : ""}`}
            onClick={() => handleOpenModal()}
          >
            Clear Cart
          </button>

          <button
            className={`btn btn-lg btn-outline-dark px-3 rounded-pill ${
              cartItems.length > 0 ? "" : "disabled"
            } ${networkRequest ? "disabled" : ""}`}
            onClick={createCheckoutSession}
          >
            {!networkRequest && "Checkout"}
            {networkRequest && (
              <OribitalLoading size="small" variant="spokes" />
            )}
          </button>
        </div>
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
