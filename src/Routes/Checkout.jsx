import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import numeral from "numeral";

import ErrorMessage from "../Components/ErrorMessage";
import { useForm } from "react-hook-form";
import { schema } from "../Utils/yup-schemas-validator/checkout-schema";
import { useCart } from "../app-context/cart-context";

const Checkout = () => {
  const { getCartItems } = useCart();

  const [total, setTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data) => {
    console.log(data);
  };

  useEffect(() => {
    initialize();
  }, []);

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

  const buildCartSummary = () => {
    return cartItems.map((item) => {
      const { id, title, salesPrice, qty } = item;
      return (
        <div className="d-flex border border-light my-2 shadow-sm" key={id}>
          <span className="me-auto my-2 p-2 ">
            {title} x {qty}
          </span>
          <span className="ms-auto my-2 p-2">
            £{numeral(salesPrice).multiply(qty).value()}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="container-lg">
      <h2 className="text-center my-5 display-5">Checkout</h2>
      <Form className="p-4 border rounded-3">
        <div className="row">
          <div className="col-12 col-md-7 py-3">
            <h4>
              Billing{" "}
              <span
                className="text-primary"
                style={{ fontFamily: "Abril Fatface" }}
              >
                Details
              </span>
            </h4>
            {/* <h4>Edit Info</h4> */}
            <Row className="mb-3">
              <Form.Group
                className="my-2 my-sm-3"
                as={Col}
                xs="12"
                controlId="fname"
              >
                <Form.Label>First Name *</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="First Name..."
                  {...register("fname")}
                />
                <ErrorMessage source={errors.fname} />
              </Form.Group>

              <Form.Group
                className="my-2 my-sm-3"
                as={Col}
                xs="12"
                controlId="lname"
              >
                <Form.Label>Last Name *</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Last Name..."
                  {...register("lname")}
                />
                <ErrorMessage source={errors.lname} />
              </Form.Group>

              <Form.Group
                className="my-2 my-sm-3"
                as={Col}
                xs="12"
                controlId="country"
              >
                <Form.Label>Country / Region *</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Country..."
                  {...register("country")}
                />
                <ErrorMessage source={errors.country} />
              </Form.Group>

              <Form.Group
                className="my-2 my-sm-3"
                as={Col}
                xs="12"
                controlId="address"
              >
                <Form.Label>Street address *</Form.Label>
                <Form.Control
                  as={"textarea"}
                  required
                  style={{
                    height: "100px",
                  }}
                  type="text"
                  placeholder="Street address *..."
                  {...register("address")}
                />
                <ErrorMessage source={errors.address} />
              </Form.Group>

              <Form.Group
                className="my-2 my-sm-3"
                as={Col}
                xs="12"
                controlId="town"
              >
                <Form.Label>Town / City *</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Town..."
                  {...register("town")}
                />
                <ErrorMessage source={errors.town} />
              </Form.Group>

              <Form.Group
                className="my-2 my-sm-3"
                as={Col}
                xs="12"
                controlId="state"
              >
                <Form.Label>State *</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="State..."
                  {...register("state")}
                />
                <ErrorMessage source={errors.state} />
              </Form.Group>

              <Form.Group
                className="my-2 my-sm-3"
                as={Col}
                xs="12"
                controlId="phone_number"
              >
                <Form.Label>Phone Number *</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Phone *..."
                  {...register("phone_number")}
                />
                <ErrorMessage source={errors.phone_number} />
              </Form.Group>

              <Form.Group
                className="my-2 my-sm-3"
                as={Col}
                xs="12"
                controlId="email"
              >
                <Form.Label>Email address *</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="name@mail.com"
                  {...register("email")}
                />
                <ErrorMessage source={errors.email} />
              </Form.Group>

              <Form.Group
                className="my-2 my-sm-3"
                as={Col}
                xs="12"
                controlId="notes"
              >
                <Form.Label>Order notes (optional)</Form.Label>
                <Form.Control
                  as={"textarea"}
                  style={{
                    height: "100px",
                  }}
                  type="text"
                  placeholder="Order notes (optional)..."
                  {...register("notes")}
                />
                <ErrorMessage source={errors.notes} />
              </Form.Group>
            </Row>
          </div>

          <div className="col-12 col-md-5 bg-light py-2 rounded-3 shadow-sm">
            <h3>
              Your{" "}
              <span
                className="text-primary"
                style={{ fontFamily: "Abril Fatface" }}
              >
                Order
              </span>
            </h3>
            <hr />
            <div className="d-flex border border-light my-2 shadow-sm">
              <span className="me-auto my-2 p-2 fw-bold h5">Product</span>
              <span className="ms-auto my-2 p-2 fw-bold">Subtotal</span>
            </div>

            {buildCartSummary()}

            <hr />
            <div className="d-flex border border-light my-2 shadow-sm">
              <span className="me-auto my-2 p-2 h6">Total</span>
              <span className="ms-auto my-2 p-2 text-danger fw-bold">
                £{total}
              </span>
            </div>
            <hr />

            <Form.Group className="border border-light my-2 shadow-sm p-3">
              <Form.Label>Payment Method</Form.Label>
              <div>
                <Form.Check
                  className="py-3"
                  name="payment_method"
                  type="radio"
                  label="Credit Card"
                  value="credit_card"
                  {...register("payment_method")}
                />
                <Form.Check
                  className="py-3"
                  name="payment_method"
                  type="radio"
                  label="Cash on delivery"
                  value="cash_on_delivery"
                  {...register("payment_method")}
                />
              </div>
              <ErrorMessage source={errors.payment_method} />
            </Form.Group>

            <div>
              <label className="d-flex gap-2 p-3" htmlFor="terms">
                <input type="checkbox" name="paymentOption" id="terms" />I have
                read and agree to the website terms and conditions *
              </label>
            </div>
            <div className="mt-3">
              <Button
                className="rounded-pill"
                variant="outline-danger"
                type="submit"
                size="lg"
                onClick={handleSubmit(onSubmit)}
              >
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Checkout;
