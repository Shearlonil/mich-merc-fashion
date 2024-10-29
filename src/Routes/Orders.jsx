import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { object, string, date, boolean, ref } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { Controller, useForm } from "react-hook-form";

import { useAuth } from "../app-context/auth-user-context";
import purchaseController from "../controllers/purchase-controller";
import handleErrMsg from "../Utils/error-handler";
import PaginationLite from "../Components/PaginationLite";
import ErrorMessage from "../Components/ErrorMessage";

const Orders = () => {
  const navigate = useNavigate();

  const schema = object().shape(
    {
      order_id: string().when("order_id", (value) => {
        if (value[0] !== undefined && value[0] !== "") {
          return string().required("Order ID is required");
        } else {
          return string().nullable().optional();
        }
      }),
      date_filter: boolean(),
      startDate: date(),
      endDate: date().min(ref("startDate"), "Please update start date"),
    },
    [
      ["order_id", "order_id"], //cyclic dependency
    ]
  );

  const { handleRefresh, logout } = useAuth();

  const [networkRequest, setNetworkRequest] = useState(true);
  const [orders, setOrders] = useState([]);

  // mode represents request type: 0 unattended/new orders, 1 means custom search with the search button clicked
  const [requestMode, setRequestMode] = useState(0);

  // for pagination
  const [pageSize] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxID, setMaxID] = useState(0);
  const [totalItemsCount, setTotalItemsCount] = useState(0);

  //  data returned from DataPagination
  const [pagedData, setPagedData] = useState([]);

  const [reqBody, setReqBody] = useState({
    order_id: "",
    pageSize,
    maxID: 0,
  });

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      order_id: "",
      date_filter: false,
    },
  });

  const date_filter = watch("date_filter");
  const startDate = watch("startDate");

  const onsubmit = async (data) => {
    setRequestMode(1);
    if (!date_filter) {
      delete data.startDate;
      delete data.endDate;
    }
    console.log(data);
    try {
      resetStates();
      setReqBody(data);
      setNetworkRequest(true);

      // const response = await purchaseController.orderSearch(data);

      //check if the request to fetch item doesn't fail before setting values to display
      // if (response && response.data) {
      //   setOrders(response.data.orders);
      //   setTotalItemsCount(response.data.count);
      //   setMaxID(response.data.orders[response.data.orders.length - 1].id);
      // }
      setNetworkRequest(false);
    } catch (error) {
      // Incase of 408 Timeout error (Token Expiration), perform refresh
      try {
        if (error.response?.status === 408) {
          await handleRefresh();
          return performCustomSearch(reqBody);
        }
        // display error message
        toast.error(handleErrMsg(error).msg);
      } catch (error) {
        // if error while refreshing, logout and delete all cookies
        logout();
      }
    }
  };

  const setPageChanged = async (pageNumber) => {
    const startIndex = (pageNumber - 1) * pageSize;
    if (pageNumber === 1) {
      const arr = orders.slice(startIndex, startIndex + pageSize);
      setPagedData(arr);
    } else {
      if (orders.length > startIndex) {
        const arr = orders.slice(startIndex, startIndex + pageSize);

        setPagedData(arr);
      } else {
        switch (requestMode) {
          case 0:
            // 0 unattended/new orders
            paginateOrders(pageNumber, pageNumber - currentPage);
            break;
          case 1:
            // search button clicked
            break;
        }
      }
    }
  };

  const paginateCustomOrderSearch = async (pageNumber, pageSpan) => {
    try {
      setNetworkRequest(true);
      setPagedData([]);
      const response = await purchaseController.paginateOrders(
        pageNumber,
        pageSize,
        pageSpan,
        maxID
      );

      //  check if the request to fetch indstries doesn't fail before setting values to display
      if (response && response.data) {
        setMaxID(response.data[response.data.length - 1].id);
        setOrders([...orders, ...response.data]);
        /*  normally, we would call setPagedData(response.data.orders) here but that isn't necessary because calling setCurrentPage(pageNumber)
			would cause PaginationLite to re-render as currentPage is part of it's useEffect dependencies. This re-render triggers setPageChanged to be
			called with currentPage number. the 'else if' block then executes causing setPagedData to be set  */
        setCurrentPage(pageNumber);
      }
      // update page number
      setNetworkRequest(false);
    } catch (error) {
      // Incase of 408 Timeout error (Token Expiration), perform refresh
      try {
        if (error.response?.status === 408) {
          await handleRefresh();
          return paginateOrders(pageNumber, pageSpan);
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

  const paginateOrders = async (pageNumber, pageSpan) => {
    try {
      setNetworkRequest(true);
      setPagedData([]);
      const response = await purchaseController.paginateOrders(
        pageNumber,
        pageSize,
        pageSpan,
        maxID
      );

      //  check if the request to fetch indstries doesn't fail before setting values to display
      if (response && response.data) {
        setMaxID(response.data[response.data.length - 1].id);
        setOrders([...orders, ...response.data]);
        /*  normally, we would call setPagedData(response.data.orders) here but that isn't necessary because calling setCurrentPage(pageNumber)
			would cause PaginationLite to re-render as currentPage is part of it's useEffect dependencies. This re-render triggers setPageChanged to be
			called with currentPage number. the 'else if' block then executes causing setPagedData to be set  */
        setCurrentPage(pageNumber);
      }
      // update page number
      setNetworkRequest(false);
    } catch (error) {
      // Incase of 408 Timeout error (Token Expiration), perform refresh
      try {
        if (error.response?.status === 408) {
          await handleRefresh();
          return paginateOrders(pageNumber, pageSpan);
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

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      setNetworkRequest(true);

      const response = await purchaseController.getNewOrders();

      //check if the request to fetch item doesn't fail before setting values to display
      if (response && response.data) {
        setOrders(response.data.orders);
        setPagedData(response.data.orders);
        setTotalItemsCount(response.data.count);
        setMaxID(response.data.orders[response.data.orders.length - 1].id);
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

  const resetStates = () => {
    setOrders([]);
    setCurrentPage(1);
    setTotalItemsCount(0);
  };

  const buildProductCards = () => {
    return pagedData.map((order) => {
      const { id, fname, phone, email, city, createdAt, PurchaseOrder } = order;
      return (
        <div key={id}>
          <div className="row mt-4">
            <div className="col-md-4 col-12 p-0">
              <div className="d-flex">
                <div className="ms-3">
                  <h2 className="mb-2">{fname}</h2>
                  <span className="mb-2 text-primary">{email}</span>
                  <p className="mb-2">{PurchaseOrder.order_id}</p>
                  <button
                    className={`btn btn-sm btn-outline-danger px-3 rounded-pill`}
                    onClick={() => navigate(`${PurchaseOrder.id}`)}
                  >
                    view
                  </button>
                </div>
              </div>
            </div>

            {/* ONLY DISPLAY ON MOBILE VIEW. FROM md upward never show */}
            <div className="row d-md-none mb-2 mt-2">
              <div className="col-md-3 col-4">City</div>
              <div className="col-md-3 col-4">Phone</div>
              <div className="col-md-2 col-4">Date</div>
            </div>

            <div
              className="col-md-3 col-4 p-0"
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              <span className="ms-2 me-2">{city}</span>
            </div>
            <div
              className="col-md-3 col-4 p-0"
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {phone}
            </div>
            <div className="col-md-2 col-4 p-0">
              {format(createdAt, "MM/dd/yyyy")}
            </div>
          </div>
          <hr />
        </div>
      );
    });
  };

  const buildSkeleton = () => {
    return new Array(4).fill(1).map((index) => (
      <div key={Math.random()}>
        <div className="row mt-4">
          <div className="col-md-4 col-12">
            <div className="ms-3">
              <p className="fw-bold mb-2">
                <Skeleton width={200} />
              </p>
              <Skeleton width={200} />
            </div>
          </div>

          {/* ONLY DISPLAY ON MOBILE VIEW. FROM md upward never show */}
          <div className="row d-md-none mb-2 mt-2">
            <div className="col-md-3 col-4">City</div>
            <div className="col-md-3 col-4">Phone</div>
            <div className="col-md-2 col-4">Date</div>
          </div>

          <div className="col-md-3 col-4">
            <Skeleton />
          </div>
          <div className="col-md-3 col-4">
            <Skeleton />
          </div>
          <div className="col-md-2 col-4 fw-bold">
            <Skeleton />
          </div>
        </div>
        <hr />
      </div>
    ));
  };

  return (
    <div className="container my-5">
      <div
        className="border py-4 px-5 bg-white-subtle rounded-4"
        style={{ boxShadow: "black 3px 2px 5px" }}
      >
        <Row className="align-items-center">
          <Col sm lg="3" className="mt-3 mt-md-0 col-sm-12 col-md-6">
            <Form.Group className="w-100" as={Col} sm="6" controlId="order_id">
              <Form.Label className="fw-bold">Order ID</Form.Label>
              <Controller
                name="order_id"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    className="shadow-sm"
                    type="text"
                    size="md"
                    isInvalid={!!errors.order_id}
                    placeholder="Order ID..."
                    {...field}
                  />
                )}
              />
              <ErrorMessage source={errors.order_id} />
            </Form.Group>
          </Col>
          {date_filter && (
            <div className="d-flex col-sm-12 col-md-6 container row">
              <Col sm lg="3" className="mt-3 mt-md-0 w-50">
                <Form.Label className="fw-bold">Start Date</Form.Label>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <Datetime
                      {...field}
                      timeFormat={false}
                      closeOnSelect={true}
                      dateFormat="DD/MM/YYYY"
                      inputProps={{
                        placeholder: "Choose start date",
                        className: "form-control",
                        readOnly: true, // Optional: makes input read-only
                      }}
                      onChange={(date) => {
                        setValue("endDate", date.toDate());
                        field.onChange(date ? date.toDate() : null);
                      }}
                    />
                  )}
                />
                <ErrorMessage source={errors.startDate} />
              </Col>
              <Col sm lg="3" className="mt-3 mt-md-0 w-50">
                <Form.Label className="fw-bold">End Date</Form.Label>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <Datetime
                      {...field}
                      timeFormat={false}
                      closeOnSelect={true}
                      dateFormat="DD/MM/YYYY"
                      inputProps={{
                        placeholder: "Choose end date",
                        className: "form-control",
                        readOnly: true, // Optional: makes input read-only
                      }}
                      onChange={(date) =>
                        field.onChange(date ? date.toDate() : null)
                      }
                      isValidDate={(current) => {
                        // Ensure end date is after start date
                        return (
                          !startDate || current.isSameOrAfter(startDate, "day")
                        );
                      }}
                    />
                  )}
                />
                <ErrorMessage source={errors.endDate} />
              </Col>
            </div>
          )}

          <Col sm lg="3" className="align-self-end text-center mt-3">
            <Button className="w-100" onClick={handleSubmit(onsubmit)}>
              Search
            </Button>
          </Col>
        </Row>
        <div className="d-flex gap-3 mt-3">
          <Form.Group controlId="date_filter">
            <Controller
              name="date_filter"
              control={control}
              render={({ field }) => (
                <Form.Check
                  type="checkbox"
                  label="Include Date"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
          </Form.Group>
        </div>
      </div>

      <h2 className="paytone-one text-success mt-4">Orders</h2>

      {/* only display in md. Never display in mobile view */}
      <div className="d-none d-md-block mt-4">
        <div className="row mb-2">
          <div className="col-md-4 col-12 fw-bold">Details</div>
          <div className="col-md-3 col-4 fw-bold">City</div>
          <div className="col-md-3 col-4 fw-bold">Phone</div>
          <div className="col-md-2 col-4 fw-bold">Date</div>
        </div>
      </div>
      <hr />

      {!networkRequest && pagedData.length > 0 && buildProductCards()}
      {networkRequest && buildSkeleton()}
      <PaginationLite
        itemCount={totalItemsCount}
        pageSize={pageSize}
        setPageChanged={setPageChanged}
        pageNumber={currentPage}
      />
    </div>
  );
};

export default Orders;
