import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import numeral from "numeral";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import { useAuth } from "../app-context/auth-user-context";
import handleErrMsg from "../Utils/error-handler";
import purchaseController from "../controllers/purchase-controller";

const OrderDetails = () => {
  const { order_id } = useParams();

  const { handleRefresh, logout } = useAuth();

  const [networkRequest, setNetworkRequest] = useState(true);

  const [total, setTotal] = useState(0);
  const [billingDetails, setBillingDetails] = useState({});
  const [salesRecord, setSalesRecord] = useState([]);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      setNetworkRequest(true);

      const response = await purchaseController.searchByPurchaseOrderID(
        order_id
      );

      //check if the request to fetch item doesn't fail before setting values to display
      if (response && response.data) {
        setSalesRecord(response.data.SalesRecords);
        setBillingDetails(response.data.BillingDetail);
        setTotal(
          response.data.SalesRecords.reduce(
            (accumulator, currentVal) =>
              numeral(currentVal.qty)
                .multiply(currentVal.sales_price)
                .add(accumulator)
                .value(),
            0
          )
        );
      }

      setNetworkRequest(false);
    } catch (error) {
      // Incase of 408 Timeout error (Token Expiration), perform refresh
      try {
        if (error.response?.status === 408) {
          await handleRefresh();
          return initialize();
        }
        // display error message
        toast.error(handleErrMsg(error).msg);
      } catch (error) {
        // if error while refreshing, logout and delete all cookies
        logout();
      }
      setNetworkRequest(false);
    }
  };

  const buildCartSummary = () => {
    return salesRecord.map((salesRecord) => {
      const { id, Item, sales_price, unit_price, discount, qty } = salesRecord;
      return (
        <div className="d-flex border border-light my-2 shadow-sm" key={id}>
          <div className="d-flex flex-column">
            <span className="me-auto my-2 p-2 ">
              {Item.title} x {qty}
            </span>
            <div className="d-flex">
              <div>
                <span className="my-2 p-2 text-success">Price</span>
                <span>{unit_price}</span>
              </div>
              <div className="ms-3">
                <span className="my-2 p-2 text-danger">discount</span>
                <span>{numeral(discount).value()}%</span>
              </div>
            </div>
          </div>
          <span className="ms-auto my-2 p-2">
            £{numeral(sales_price).multiply(qty).value()}
          </span>
        </div>
      );
    });
  };

  const buildDetailsSection = () => {
    return (
      <Row className="mb-3">
        <div className="my-2" as={Col} xs="12">
          <p>First Name</p>
          <span>{billingDetails.fname}</span>
        </div>

        <div className="my-2" as={Col} xs="12">
          <p>Last Name</p>
          <span>{billingDetails.lname}</span>
        </div>

        <div className="my-2 my-sm-3" as={Col} xs="12">
          <p>Country / Region</p>
          <span>{billingDetails.country}</span>
        </div>

        <div className="my-2 my-sm-3" as={Col} xs="12">
          <p>Street address</p>
          <span>{billingDetails.street_address}</span>
        </div>

        <div className="my-2 my-sm-3" as={Col} xs="12">
          <p>Town / City</p>
          <span>{billingDetails.city}</span>
        </div>

        <div className="my-2 my-sm-3" as={Col} xs="12">
          <p>State</p>
          <span>{billingDetails.state}</span>
        </div>

        <div className="my-2 my-sm-3" as={Col} xs="12">
          <p>Phone Number</p>
          <span>{billingDetails.phone}</span>
        </div>

        <div className="my-2 my-sm-3" as={Col} xs="12">
          <p>Email address</p>
          <span>{billingDetails.email}</span>
        </div>

        <div className="my-2 my-sm-3" as={Col} xs="12">
          <p>Order notes (optional)</p>
          <span>{billingDetails.OrderNote?.notes}</span>
        </div>
      </Row>
    );
  };

  const buildSkeletonDetailsSection = () => {
    return (
      <Row className="mb-3">
        <div className="my-2" as={Col} xs="12">
          <Skeleton width={"75%"} />
        </div>

        <div className="my-2" as={Col} xs="12">
          <Skeleton width={"75%"} />
        </div>

        <div className="my-2 my-sm-3" as={Col} xs="12">
          <Skeleton width={"75%"} />
        </div>

        <div className="my-2 my-sm-3" as={Col} xs="12">
          <Skeleton width={"75%"} />
        </div>

        <div className="my-2 my-sm-3" as={Col} xs="12">
          <Skeleton width={"75%"} />
        </div>

        <div className="my-2 my-sm-3" as={Col} xs="12">
          <Skeleton width={"75%"} />
        </div>

        <div className="my-2 my-sm-3" as={Col} xs="12">
          <Skeleton width={"75%"} />
        </div>

        <div className="my-2 my-sm-3" as={Col} xs="12">
          <Skeleton width={"75%"} />
        </div>

        <div className="my-2 my-sm-3" as={Col} xs="12">
          <Skeleton width={"75%"} />
        </div>
      </Row>
    );
  };

  return (
    <div className="container-lg">
      <h2 className="text-center my-5 display-5">Purhase Order</h2>
      <div className="p-4 border rounded-3">
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
            {!networkRequest && buildDetailsSection()}
            {networkRequest && buildSkeletonDetailsSection()}
          </div>

          <div className="col-12 col-md-5 bg-light py-2 rounded-3 shadow-sm">
            <h3>
              Order{" "}
              <span
                className="text-primary"
                style={{ fontFamily: "Abril Fatface" }}
              >
                Details
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

            <div className="border border-light my-2 shadow-sm p-3">
              <p>Payment Method</p>
            </div>

            <div className="mt-3">
              <Button
                className={`rounded-pill ${networkRequest ? "disabled" : ""}`}
                variant="outline-danger"
                type="submit"
                size="lg"
                // onClick={handleSubmit(onSubmit)}
              >
                Complete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
