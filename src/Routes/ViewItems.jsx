import React, { useEffect, useState } from "react";
import { Col, FloatingLabel, Form, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select";

import { capitalizeFirstLetter } from "../Utils/helpers";
import handleErrMsg from "../Utils/error-handler";
import itemController from "../controllers/item-controller";
import { useAuth } from "../app-context/auth-user-context";
import { catOptions, stateOptions } from "../../data";
import { boolean } from "yup";

const ViewItems = () => {
  const [networkRequest, setNetworkRequest] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedCat, setSelectedCat] = useState(catOptions[0]);
  const [selectedAvailability, setSelectedAvailability] = useState(
    stateOptions[0]
  );

  const [reqBody, setReqBody] = useState({
    title: "",
    cat_name: "",
    limit: 8,
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
    if (typeof selected.value === boolean) {
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
        <Table striped className="border" responsive="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Categories</th>
              <th>Available</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/*{Object.entries(SHOP_DATA).map(([cat, items], index) => {
							return items.map(({ name }, index) => {
								return (
									<tr>
										<td>{index}</td>
										<td>{name}</td>
										<td>{capitalizeFirstLetter(cat)}</td>
										<td>
											<span className="text-danger fw-bold">none</span>
										</td>
										<td>01/10/2024</td>
										<th>
											<Link to={"details"}>View</Link>
										</th>
									</tr>
								);
							});
						})}
						 <tr>
							<td>1</td>
							<td>John Doe</td>
							<td>johndoe@gmail.com</td>
							<td>07012345678</td>
							<th>
								<Link to={"details"}>View</Link>
							</th>
						</tr>
						<tr>
							<td>2</td>
							<td>John Doe</td>
							<td>johndoe@gmail.com</td>
							<td>07012345678</td>
							<th>
								<Link to={"details"}>View</Link>
							</th>
						</tr>
						<tr>
							<td>3</td>
							<td>John Doe</td>
							<td>johndoe@gmail.com</td>
							<td>07012345678</td>
							<th>
								<Link to={"details"}>View</Link>
							</th>
						</tr> */}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default ViewItems;
