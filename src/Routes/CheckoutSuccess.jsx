import React, { useEffect } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useCart } from "../app-context/cart-context";

const CheckoutSuccess = () => {
  const navigate = useNavigate();

  const { clear } = useCart();

  useEffect(() => {
    // clear();
  }, []);

  return (
    <div className="mt-auto mb-auto">
      <div className="align-self-center justify-self-center">
        <div className="container mx-auto">
          <main
            className="form-signin m-auto"
            style={{ minWidth: "320px", maxWidth: "350px" }}
          >
            <div className="text-center text-dark">
              <img
                className="mb-4"
                src={logo}
                alt=""
                // width="90"
                height="120"
              />
              <h1 className="h3 mb-3 fw-normal">Checkout successful</h1>

              <div className="bg-success-subtle rounded mb-3 p-3 text-start">
                <p>
                  Thank you for completing your order. We hope you love your
                  item as much as we loved making/ building/ creating it!
                </p>
                <p>
                  A mail has been sent to the email provided during payment. If
                  not found in your inbox, please check your spam
                </p>
                <p>Regards!</p>
              </div>
              <button
                className="btn btn-outline-primary w-100 my-2 py-2"
                type="submit"
                onClick={() => navigate("/shop")}
              >
                continue shopping
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
