import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select";
// yup
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import ErrorMessage from "../Components/ErrorMessage";
import { PrevImg } from "../Components/Styles/CreateItemStyle";
import IMAGES from "../images/images";
import { BiTrashAlt } from "react-icons/bi";
import itemController from "../controllers/item-controller";
import handleErrMsg from "../Utils/error-handler";
import { useAuth } from "../app-context/auth-user-context";
import { availabilityOptions, categoryOptions } from "../../data";
import ImageComponent from "../Components/ImageComponent";

const schema = yup.object().shape({
  product_name: yup.string().required("First name is required!"),
  price: yup.string().required("Price is required!"),
  available: yup
    .object()
    .shape({
      label: yup.string().required("Invalid value"),
      value: yup.string().required("Invalid value"),
    })
    .required("Status  is required"),
  description: yup.string().required("Description"),
  category: yup
    .object()
    .shape({
      label: yup.string().required("Invalid value"),
      value: yup.string().required("Invalid value"),
    })
    .required("Category is required!"),
});

const ViewItemsDetails = () => {
  const { id } = useParams();

  const { handleRefresh, logout } = useAuth();

  const [networkRequest, setNetworkRequest] = useState(false);

  const [show, setShow] = useState(false);
  const [selectedImageIndex, setSelectedImage] = useState(null);
  const [newImage, setNewImage] = useState([]);
  const [previewImageUrl, setPreviewImageUrl] = useState([]);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const deleteItem = (indexToDelete) => {
    if (previewImageUrl.length > 0) {
      const removedImage = previewImageUrl[indexToDelete];
      URL.revokeObjectURL(removedImage); // Clean up memory

      setPreviewImageUrl((prevItems) =>
        prevItems.filter((_, index) => index !== indexToDelete)
      );
    } else {
      setPreviewImageUrl((prevItems) => [...prevItems]);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      setNetworkRequest(true);

      const response = await itemController.findById(id);

      //check if the request to fetch item doesn't fail before setting values to display
      if (response && response.data) {
        const cat = {
          label: response.data.Category.name,
          value: response.data.Category.name.toLowerCase(),
        };
        const status = {
          label: response.data.state === true ? "In-Stock" : "Out-Of-Stock",
          value: response.data.state,
        };
        setValue("product_name", response.data.title);
        setValue("description", response.data.desc);
        setValue("price", response.data.price);
        setValue("category", cat);
        setValue("available", status);
        setPreviewImageUrl(response.data.ItemImages);
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

  // create a preview
  const handleAddNewImage = (event) => {
    const uploaded_images = event.target.files;
    const totalImages = uploaded_images.length + previewImageUrl.length;

    if (totalImages <= 4) {
      let newImageArray = [];

      for (let i = 0; i < uploaded_images.length; i++) {
        let prev_image_file_path = URL.createObjectURL(uploaded_images[i]);
        const img = {
          ...uploaded_images[i],
          file_name: prev_image_file_path,
          blur_hash: "U8C$_;4n00%gD%%2t7V[00NG~q%2D%-;RjMx",
          offline: "",
        };
        console.log(prev_image_file_path);
        // newImage.push(prev_image_file_path); // Collect the new images
        // setPreviewImageUrl((prevItems) => [...prevItems, prev_image_file_path]);
        setPreviewImageUrl([...previewImageUrl, img]);
      }
      // setNewImage((prevImages) => [...prevImages, ...newImageArray]);
    } else {
      setPreviewImageUrl((prevItems) => [...prevItems]);
      alert("You can only upload a maximum of 4 images.");
    }

    event.target.value = "";
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      product_name: "",
      price: "",
      available: "",
      description: "",
      image_upload: "1",
    },
  });

  const onSubmit = (data) => {
    console.log("the data", data);
  };

  return (
    <>
      <div className="container my-4">
        <h2 className="display-6 mb-3">
          Edit{" "}
          <span
            className="text-primary"
            style={{ fontFamily: "Abril Fatface" }}
          >
            Product{" "}
          </span>
          Details
        </h2>
        <Form className="bg-light p-4 rounded-4 border border-2">
          {/* <h4>Edit Info</h4> */}
          <Row className="mb-3">
            <Form.Group
              className="my-2 my-sm-3"
              as={Col}
              sm="6"
              controlId="product_name"
            >
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Product Name..."
                {...register("product_name")}
              />
              <ErrorMessage source={errors.product_name} />
            </Form.Group>

            <Form.Group
              className="my-2 my-sm-3"
              as={Col}
              sm="6"
              controlId="price"
            >
              <Form.Label>Price (£)</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Price..."
                {...register("price")}
              />
              <ErrorMessage source={errors.price} />
            </Form.Group>

            <Form.Group
              className="my-2 my-sm-3"
              as={Col}
              sm="6"
              controlId="category"
            >
              <Form.Label>Category</Form.Label>
              <Controller
                name="category"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    required
                    placeholder="Category..."
                    {...register("category")}
                    options={categoryOptions}
                    onChange={(val) => onChange(val)}
                    value={value}
                  />
                )}
              />
              <ErrorMessage source={errors.category} />
            </Form.Group>

            <Form.Group
              className="my-2 my-sm-3"
              as={Col}
              sm="6"
              controlId="available"
            >
              <Form.Label>Status</Form.Label>
              <Controller
                name="available"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    required
                    placeholder="Availability..."
                    {...register("available")}
                    options={availabilityOptions}
                    onChange={(val) => onChange(val)}
                    value={value}
                  />
                )}
              />
              <ErrorMessage source={errors.available} />
            </Form.Group>

            <Form.Group
              className="my-2 my-sm-3"
              as={Col}
              sm="6"
              controlId="description"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control
                as={"textarea"}
                required
                style={{
                  height: "100px",
                }}
                type="text"
                placeholder="Description..."
                {...register("description")}
              />
              <ErrorMessage source={errors.description} />
            </Form.Group>
          </Row>
          <div className="text-center">
            <Button
              variant="outline-primary"
              type="submit"
              size="lg"
              onClick={handleSubmit(onSubmit)}
            >
              Update
            </Button>
          </div>
        </Form>

        <hr className="my-4" />

        <Form className="bg-light p-4 rounded-4 border border-2">
          <h2 className="mb-4">
            Update{" "}
            <span
              className="text-primary"
              style={{ fontFamily: "Abril Fatface" }}
            >
              Images
            </span>
          </h2>
          <div className="row m-2 gap-3">
            {previewImageUrl.length > 0 &&
              previewImageUrl.map((img, index) => {
                return (
                  <PrevImg className={`col-sm-6 border rounded`} key={index}>
                    <ImageComponent
                      image={img}
                      width={"100%"}
                      height={"100%"}
                    />
                    <BiTrashAlt
                      onClick={() => {
                        handleShow();
                        setSelectedImage(index);
                      }}
                      size={25}
                      className="delete_icon"
                    />
                    <div className="overlay"></div>
                  </PrevImg>
                );
              })}
          </div>
          <Col className="my-2" xs={"12"} md="6">
            <Form.Group controlId="image_upload">
              <Form.Label>Select Image Upload</Form.Label>
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
                      handleAddNewImage(e); // add the new image
                      field.onChange(e.target.files); // Update form state
                    }}
                    isInvalid={!!errors.image_upload} // Show invalid state if there are errors
                  />
                )}
              />
              <ErrorMessage source={errors.image_upload} />
            </Form.Group>
          </Col>
          <Button variant="primary" size="lg" onClick={handleShow}>
            Update
          </Button>
        </Form>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this Image?
            <ImageComponent
              image={previewImageUrl[selectedImageIndex]}
              width={"100%"}
              height={"100%"}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="success"
              onClick={() => {
                deleteItem(selectedImageIndex);
                handleClose();
              }}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default ViewItemsDetails;
