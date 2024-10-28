import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { object, string, date, ref } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
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

      startDate: date().required("Start date is required"),
      endDate: date()
        .required("End date is required")
        .min(ref("startDate"), "End date cannot be before start date"),
    },
    [
      ["order_id", "order_id"], //cyclic dependency
    ]
  );

  const { handleRefresh, logout } = useAuth();

  const currentDate = new Date();

  const [networkRequest, setNetworkRequest] = useState(true);
  const [orders, setOrders] = useState([]);

  // for pagination
  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [idOffset, setIdOffset] = useState(0);
  const [totalItemsCount, setTotalItemsCount] = useState(0);

  //  data returned from DataPagination
  const [pagedData, setPagedData] = useState([]);

  const [reqBody, setReqBody] = useState({
    order_id: "",
    pageSize,
    idOffset: 0,
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
      startDate: currentDate,
      endDate: currentDate,
      order_id: "",
    },
  });

  const startDate = watch("startDate");

  const onsubmit = async (data) => {
    console.log(data);
    try {
      resetStates();
      setReqBody(data);
      setNetworkRequest(true);

      const response = await purchaseController.orderSearch(data);

      //check if the request to fetch item doesn't fail before setting values to display
      if (response && response.data) {
        setOrders(response.data.orders);
        setTotalItemsCount(response.data.count);
        setIdOffset(response.data.orders[response.data.orders.length - 1].id);
      }
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
        paginateFetch(pageNumber, pageNumber - currentPage);
      }
    }
  };

  const paginateFetch = async (pageNumber, pageSpan) => {
    try {
      setNetworkRequest(true);
      setPagedData([]);
      const temp = { ...reqBody };
      temp.idOffset = idOffset;
      temp.pageSpan = pageSpan;
      setReqBody(temp);
      const response = await purchaseController.paginateOrderSearch(
        temp,
        pageNumber
      );

      //  check if the request to fetch indstries doesn't fail before setting values to display
      if (response && response.data) {
        setIdOffset(response.data[response.data.length - 1].id);
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
          return paginateFetch(pageNumber, pageSpan);
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
        setIdOffset(response.data.orders[response.data.orders.length - 1].id);
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
    return pagedData.map((item) => {
      const { id, title, ItemImages, state, createdAt, Category } = item;
      return (
        <div key={id}>
          <div className="row mt-5">
            <div className="col-md-6 col-12">
              <div className="d-flex">
                <div className="ms-3">
                  <p className="fw-bold mb-2">{title}</p>
                  <button
                    className={`btn btn-sm btn-outline-danger px-3 rounded-pill`}
                    onClick={() => navigate(`details/${id}`)}
                  >
                    view
                  </button>
                </div>
              </div>
            </div>

            {/* ONLY DISPLAY ON MOBILE VIEW. FROM md upward never show */}
            <div className="row d-md-none mb-2 mt-2">
              <div className="col-md-2 col-4">City</div>
              <div className="col-md-2 col-4">Phone</div>
              <div className="col-md-2 col-4">Email</div>
            </div>

            <div className="col-md-2 col-4">
              <span className="ms-2 me-2">{Category.name}</span>
            </div>
            <div className="col-md-2 col-4">
              {state ? "In Stock" : "Out of Stock"}
            </div>
            <div className="col-md-2 col-4 fw-bold p-0">"MM/dd/yyyy"</div>
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
          <div className="col-md-6 col-12">
            <div className="ms-3">
              <p className="fw-bold mb-2">
                <Skeleton width={200} />
              </p>
              <Skeleton width={200} />
            </div>
          </div>

          {/* ONLY DISPLAY ON MOBILE VIEW. FROM md upward never show */}
          <div className="row d-md-none mb-2 mt-2">
            <div className="col-md-2 col-4">City</div>
            <div className="col-md-2 col-4">Phone</div>
            <div className="col-md-2 col-4">Email</div>
          </div>

          <div className="col-md-2 col-4">
            <Skeleton />
          </div>
          <div className="col-md-2 col-4">
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
          <Col sm lg="3" className="mt-3 mt-md-0">
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
          <Col sm lg="3" className="mt-3 mt-md-0">
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
          <Col sm lg="3" className="mt-3 mt-md-0">
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
          <Col sm lg="3" className="align-self-end text-center mt-3">
            <Button className="w-100" onClick={handleSubmit(onsubmit)}>
              Search
            </Button>
          </Col>
        </Row>
      </div>

      <h2 className="paytone-one text-success mt-4">Orders</h2>

      {/* only display in md. Never display in mobile view */}
      <div className="d-none d-md-block mt-4">
        <div className="row mb-2">
          <div className="col-md-6 col-12 fw-bold">Details</div>
          <div className="col-md-2 col-4 fw-bold">City</div>
          <div className="col-md-2 col-4 fw-bold">Phone</div>
          <div className="col-md-2 col-4 fw-bold">Email</div>
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
