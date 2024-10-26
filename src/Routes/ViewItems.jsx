import React, { useEffect, useState } from "react";
import { Col, FloatingLabel, Form, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select";
import Skeleton from "react-loading-skeleton";
import { format } from "date-fns";

import handleErrMsg from "../Utils/error-handler";
import itemController from "../controllers/item-controller";
import { useAuth } from "../app-context/auth-user-context";
import { catOptions, stateOptions } from "../../data";
import ImageComponent from "../Components/ImageComponent";
import PaginationLite from "../Components/PaginationLite";

const ViewItems = () => {
  const navigate = useNavigate();

  const [networkRequest, setNetworkRequest] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedCat, setSelectedCat] = useState(catOptions[0]);
  const [selectedAvailability, setSelectedAvailability] = useState(
    stateOptions[0]
  );

  // for pagination
  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [idOffset, setIdOffset] = useState(0);
  const [totalItemsCount, setTotalItemsCount] = useState(0);

  //  data returned from DataPagination
  const [pagedData, setPagedData] = useState([]);

  const [reqBody, setReqBody] = useState({
    title: "",
    cat_name: "",
    pageSize,
    idOffset: 0,
  });

  const { handleRefresh, logout } = useAuth();

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      // backgroundColor: "transparent",
      color: state.isSelected ? "white" : "white",
      borderColor: "#cecec8ca",
      borderRadius: "5px",
      boxShadow: state.isFocused
        ? "0 0 0 0.25rem rgba(0, 123, 255, 0.25)"
        : "none",
      "&:focus": {
        boxShadow: "0 0 0 0.25rem rgba(0, 123, 255, 0.25)",
      },
      width: "100%",
      // height: "48px", // Match Bootstrap's default form control height
      minHeight: "48px", // Ensures the minimum height is 38px
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "rgba(0, 123, 255, 0.75)", // customize color of the dropdown arrow
    }),
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      const temp = { ...reqBody };
      temp.title = event.target.value;
      temp.idOffset = 0;
      setReqBody(temp);

      await performCustomSearch(temp);
    }
  };

  const setPageChanged = async (pageNumber) => {
    const startIndex = (pageNumber - 1) * pageSize;
    if (pageNumber === 1) {
      const arr = products.slice(startIndex, startIndex + pageSize);
      setPagedData(arr);
    } else {
      if (products.length > startIndex) {
        const arr = products.slice(startIndex, startIndex + pageSize);

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
      console.log("id offset", idOffset);
      temp.idOffset = idOffset;
      temp.pageSpan = pageSpan;
      setReqBody(temp);
      const response = await itemController.paginateProductSearch(
        temp,
        pageNumber
      );

      //  check if the request to fetch indstries doesn't fail before setting values to display
      if (response && response.data) {
        setIdOffset(response.data[response.data.length - 1].id);
        setProducts([...products, ...response.data]);
        /*  normally, we would call setPagedData(response.data.products) here but that isn't necessary because calling setCurrentPage(pageNumber)
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

  const handleCategoryChange = async (selected) => {
    // https://blog.openreplay.com/async-data-fetching-with-react-select/
    setSelectedCat(selected);
    const temp = { ...reqBody };
    temp.cat_name = selected.value;
    temp.idOffset = 0;
    setReqBody(temp);

    await performCustomSearch(temp);
  };

  const handleAvailabilityChange = async (selected) => {
    // https://blog.openreplay.com/async-data-fetching-with-react-select/
    setSelectedAvailability(selected);
    if (typeof selected.value === "boolean") {
      const temp = { ...reqBody };
      temp.availability = selected.value;
      temp.idOffset = 0;
      setReqBody(temp);
      await performCustomSearch(temp);
    } else {
      delete reqBody.availability;
      await performCustomSearch(reqBody);
    }
  };

  const performCustomSearch = async (reqBody) => {
    try {
      resetStates();
      setNetworkRequest(true);

      const response = await itemController.productSearch(reqBody);

      //check if the request to fetch item doesn't fail before setting values to display
      if (response && response.data) {
        setProducts(response.data.products);
        setTotalItemsCount(response.data.count);
        setIdOffset(
          response.data.products[response.data.products.length - 1].id
        );
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

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      setNetworkRequest(true);

      const response = await itemController.productSearch(reqBody);

      //check if the request to fetch item doesn't fail before setting values to display
      if (response && response.data) {
        setProducts(response.data.products);
        setPagedData(response.data.products);
        setTotalItemsCount(response.data.count);
        setIdOffset(
          response.data.products[response.data.products.length - 1].id
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

  const resetStates = () => {
    setProducts([]);
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
                <ImageComponent
                  image={ItemImages[0]}
                  width={"100px"}
                  height={"100px"}
                />
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
              <div className="col-md-2 col-4">Category</div>
              <div className="col-md-2 col-4">Availability</div>
              <div className="col-md-2 col-4">Date</div>
            </div>

            <div className="col-md-2 col-4">
              <span className="ms-2 me-2">{Category.name}</span>
            </div>
            <div className="col-md-2 col-4">
              {state ? "In Stock" : "Out of Stock"}
            </div>
            <div className="col-md-2 col-4 fw-bold p-0">
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
          <div className="col-md-6 col-12">
            <div className="d-flex">
              <Skeleton
                count={1}
                key={Math.random()}
                width={"100px"}
                height={"100px"}
              />
              <div className="ms-3">
                <p className="fw-bold mb-2">
                  <Skeleton width={200} />
                </p>
                <Skeleton />
              </div>
            </div>
          </div>

          {/* ONLY DISPLAY ON MOBILE VIEW. FROM md upward never show */}
          <div className="row d-md-none mb-2 mt-2">
            <div className="col-md-2 col-4">Category</div>
            <div className="col-md-2 col-4">Availability</div>
            <div className="col-md-2 col-4">Date</div>
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
    <>
      <div className="container my-5">
        <div
          className="border py-4 px-5 bg-white-subtle rounded-4"
          style={{ boxShadow: "black 3px 2px 5px" }}
        >
          <Row className="align-items-center">
            <Col sm className="d-flex flex-column pt-3 pb-3">
              <label
                className="fw-bold mb-2 fs-6 mt-auto"
                htmlFor="floatingInput1"
              >
                Title
              </label>
              <FloatingLabel
                controlId="floatingInput1"
                label="Product title"
                className="mb-1"
              >
                <Form.Control
                  className="border border-0 outline-none"
                  type="text"
                  placeholder="Product Title"
                  onKeyDown={handleKeyDown}
                />
              </FloatingLabel>
            </Col>
            <Col sm className="d-flex flex-column pt-3 pb-3">
              <label
                className="fw-bold mb-2 fs-6 mt-auto"
                htmlFor="floatingInput2"
              >
                Category
              </label>
              <Select
                required
                name="category"
                placeholder="Select..."
                className="text-dark "
                styles={customStyles}
                value={selectedCat}
                options={catOptions}
                onChange={(val) => handleCategoryChange(val)}
              />
            </Col>
            <Col sm className="d-flex flex-column pt-3 pb-3">
              <label
                className="fw-bold mb-2 fs-6 mt-auto"
                htmlFor="floatingInput3"
              >
                Availability
              </label>
              <Select
                required
                name="category"
                placeholder="Select..."
                className="text-dark "
                styles={customStyles}
                value={selectedAvailability}
                options={stateOptions}
                onChange={(val) => handleAvailabilityChange(val)}
              />
            </Col>
          </Row>
        </div>

        <h2 className="paytone-one text-success mt-4">Products</h2>

        {/* only display in md. Never display in mobile view */}
        <div className="d-none d-md-block mt-4">
          <div className="row mb-2">
            <div className="col-md-6 col-12 fw-bold">Product</div>
            <div className="col-md-2 col-4 fw-bold">Category</div>
            <div className="col-md-2 col-4 fw-bold">Availability</div>
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
    </>
  );
};

export default ViewItems;
