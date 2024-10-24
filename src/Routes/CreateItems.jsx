import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { BiTrashAlt } from "react-icons/bi";
import Select from "react-select";
import { toast } from "react-toastify";

import { schema } from "../Utils/yup-schemas-validator/create-item-schema";
import ErrorMessage from "../Components/ErrorMessage";
import { PrevImg } from "../Components/Styles/CreateItemStyle";
import { availabilityOptions, categoryOptions } from "../../data";
import handleErrMsg from "../Utils/error-handler";
import { useAuth } from "../app-context/auth-user-context";
import ConfirmDialogComp from "../Components/ConfirmDialogComp";
import itemController from "../controllers/item-controller";
import { ThreeDotLoading } from "../Components/react-loading-indicators/Indicator";

const CreateItems = () => {
  const { handleRefresh, logout } = useAuth();

  const [previewImageUrl, setPreviewImageUrl] = useState([]); // State for image preview
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      image_upload: [],
      product_name: "",
      price: "",
      description: "",
    },
  });

  const [networkRequest, setNetworkRequest] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [displayMsg, setDisplayMsg] = useState("");
  const [formData, setFormData] = useState({});

  const onSubmit = (data) => {
    setFormData(data);
    handleOpenModal();
  };

  const handleOpenModal = () => {
    setDisplayMsg("Create Item?");
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleConfirmAction = async () => {
    setShowModal(false);
    try {
      setNetworkRequest(true);
      await itemController.create(formData);

      setNetworkRequest(false);

      setPreviewImageUrl([]);
      reset();
      toast.info("Item successfully created");
    } catch (error) {
      // Incase of 408 Timeout error (Token Expiration), perform refresh
      try {
        if (error.response?.status === 408) {
          await handleRefresh();
          return handleConfirmAction();
        }
        // display error message
        toast.error(handleErrMsg(error).msg);
      } catch (error) {
        // if error while refreshing, logout and delete all cookies
        logout();
      }
      // display error message
      setNetworkRequest(false);
    }
  };

  const deleteItem = (indexToDelete) => {
    if (previewImageUrl.length > 0) {
      const removedImage = previewImageUrl[indexToDelete];
      URL.revokeObjectURL(removedImage); // Clean up memory

      setPreviewImageUrl((prevItems) =>
        prevItems.filter((_, index) => index !== indexToDelete)
      );
    } else {
      setPreviewImageUrl([]);
    }
  };

  // create a preview
  const handleImageChange = (event) => {
    const uploaded_images = event;
    const totalImages = uploaded_images.length + previewImageUrl.length;

    if (totalImages <= 4) {
      for (let i = 0; i < uploaded_images.length; i++) {
        let prev_image_file_path = URL.createObjectURL(uploaded_images[i]);

        setPreviewImageUrl((prevItems) => [...prevItems, prev_image_file_path]);
      }
    } else {
      toast.error("Maximum of 4 images allowed.");
    }
  };

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

  return (
    <div className="container mt-auto mb-auto">
      <Form className="my-2 border rounded p-4 bg-light">
        <Row>
          <Col className="my-2" md={"6"} xs={"12"}>
            <Form.Group className="mb-3" controlId="product_name">
              <Form.Label>Product name</Form.Label>
              <Controller
                name="product_name"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    className="shadow-sm"
                    type="text"
                    size="lg"
                    isInvalid={!!errors.product_name}
                    placeholder="Product Name..."
                    {...field}
                  />
                )}
              />{" "}
              <ErrorMessage source={errors.product_name} />
            </Form.Group>
          </Col>
          <Col className="my-2" md={"6"} xs={"12"}>
            <Form.Group className="mb-3" controlId="price">
              <Form.Label>Price</Form.Label>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    className="shadow-sm"
                    isInvalid={!!errors.price}
                    type="number"
                    size="lg"
                    placeholder="£"
                    {...field}
                  />
                )}
              />
              <ErrorMessage source={errors.price} />
            </Form.Group>
          </Col>

          <Col className="my-2" md={"6"} xs={"12"}>
            <Form.Group className="w-100" as={Col} sm="6" controlId="category">
              <Form.Label>Category</Form.Label>
              <Controller
                name="category"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    required
                    name="category"
                    placeholder="Select..."
                    className="text-dark "
                    styles={customStyles}
                    value={categoryOptions.find((e) => e.value === value)}
                    options={categoryOptions}
                    onChange={(val) => onChange(val)}
                  />
                )}
              />
              <ErrorMessage source={errors.category} />
            </Form.Group>
          </Col>

          <Col className="my-2" md={"6"} xs={"12"}>
            <Form.Group className="mb-3" controlId="available">
              <Form.Label>Availability</Form.Label>
              <Controller
                name="available"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    required
                    name="available"
                    placeholder="Select..."
                    className="text-dark "
                    styles={customStyles}
                    value={availabilityOptions.find((e) => e.value === value)}
                    options={availabilityOptions}
                    onChange={(val) => onChange(val)}
                  />
                )}
              />
              <ErrorMessage source={errors.available} />
            </Form.Group>
          </Col>

          <Col className="my-2" md={"6"} xs={"12"}>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    className="shadow-sm"
                    isInvalid={!!errors.description}
                    as={"textarea"}
                    type="text"
                    style={{ height: "130px" }}
                    placeholder="Item Description..."
                    {...field}
                  />
                )}
              />
              <ErrorMessage source={errors.description} />
            </Form.Group>
          </Col>

          <Col className="my-2" xs={"12"} md="6">
            <Form.Group controlId="image_upload">
              <Form.Label>Image Upload</Form.Label>
              <Controller
                name="image_upload"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    type="file"
                    accept="image/*"
                    size="lg"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files); // puts the image in an array
                      field.onChange(files);
                      handleImageChange(files); // sends the files array to handleImageChange
                    }}
                    isInvalid={!!errors.image_upload} // Show invalid state if there are errors
                  />
                )}
              />
              <ErrorMessage source={errors.image_upload} />
            </Form.Group>
            <div className="row m-2 gap-3">
              {previewImageUrl.map((img, index) => {
                return (
                  <PrevImg className="col-sm-6" key={index}>
                    <img
                      className="prev_img"
                      height={"100%"}
                      src={img}
                      width={"100%"}
                      alt=""
                    />
                    <BiTrashAlt
                      onClick={() => deleteItem(index)}
                      size={25}
                      className="delete_icon"
                    />
                    <div className="overlay"></div>
                  </PrevImg>
                );
              })}
            </div>
            <div className="bg-dark text-white"></div>
          </Col>
        </Row>

        <div className="w-100 d-flex flex-column align-items-center">
          <Button
            className="mt-3 btn-lg"
            variant="outline-primary"
            // type="submit"
            style={{ width: "270px" }}
            disabled={networkRequest}
            onClick={handleSubmit(onSubmit)}
          >
            {networkRequest && <ThreeDotLoading color={"#005eeb"} />}
            {!networkRequest && `Submit`}
          </Button>
        </div>
      </Form>
      <ConfirmDialogComp
        show={showModal}
        handleClose={handleCloseModal}
        handleConfirm={handleConfirmAction}
        message={displayMsg}
      />
    </div>
  );
};

export default CreateItems;
