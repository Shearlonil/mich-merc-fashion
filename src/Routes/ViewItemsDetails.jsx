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
import { BiTrashAlt } from "react-icons/bi";
import itemController from "../controllers/item-controller";
import handleErrMsg from "../Utils/error-handler";
import { useAuth } from "../app-context/auth-user-context";
import { availabilityOptions, categoryOptions } from "../../data";
import ImageComponent from "../Components/ImageComponent";
import ImgConfirmDialogComp from "../Components/ImgConfirmDialogComp";
import ConfirmDialogComp from "../Components/ConfirmDialogComp";
import Skeleton from "react-loading-skeleton";
import { ThreeDotLoading } from "../Components/react-loading-indicators/Indicator";

const schema = yup.object().shape({
  product_name: yup.string().required("First name is required!"),
  price: yup.number().required("Price is required!"),
  discount: yup.number().required("Discount is required!"),
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
  // for controlling buttons in the images update section and details update section
  const [imgUpdate, setImgUpdate] = useState(false);
  const [detailsUpdate, setDetailsUpdate] = useState(false);
  // update type (updating details or updating imgs):- 0 for details, 1 for imgs
  const [updateType, setUpdateType] = useState(null);

  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [currentImgs, setCurrentImgs] = useState([]);
  const [previewImageUrl, setPreviewImageUrl] = useState([]);

  const [showImgConfirmModal, setShowImgConfirmModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [displayMsg, setDisplayMsg] = useState("");
  const [onlineFetch, setOnlineFetch] = useState(null);
  const [imgToRemove, setImgToRemove] = useState(null);
  const [formData, setFormData] = useState({});

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
        setValue("discount", response.data.discount);
        setCurrentImgs(response.data.ItemImages);
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

  // Methods for Image Confirmation modal
  const openImgConfirmModal = (img, onlineFetch, selectedImageIndex) => {
    setOnlineFetch(onlineFetch);
    setSelectedImageIndex(selectedImageIndex);
    setDisplayMsg("Delete Item?");
    setImgToRemove(img);
    setShowImgConfirmModal(true);
  };

  const handleImgConfirmAction = async () => {
    setShowImgConfirmModal(false);
    if (onlineFetch) {
      setImgUpdate(true);
      // deleting online img
      try {
        // delete image online from database and imgs folder in server
        await itemController.unlinkImg(id, imgToRemove.id);
        // remove from UI
        if (currentImgs.length > 0) {
          const removedImage = currentImgs[selectedImageIndex];
          URL.revokeObjectURL(removedImage); // Clean up memory

          setCurrentImgs((prevItems) =>
            prevItems.filter((_, index) => index !== selectedImageIndex)
          );
        }
      } catch (error) {
        // Incase of 408 Timeout error (Token Expiration), perform refresh
        try {
          if (error.response?.status === 408) {
            await handleRefresh();
            return handleImgConfirmAction();
          }
          // display error message
          toast.error(handleErrMsg(error).msg);
        } catch (error) {
          // if error while refreshing, logout and delete all cookies
          logout();
        }
      }
      setImgUpdate(false);
    } else {
      // deleting offline img
      if (previewImageUrl.length > 0) {
        const removedImage = previewImageUrl[selectedImageIndex];
        URL.revokeObjectURL(removedImage); // Clean up memory

        setPreviewImageUrl((prevItems) =>
          prevItems.filter((_, index) => index !== selectedImageIndex)
        );
      }
    }
  };

  const closeImgConfirmModal = () => setShowImgConfirmModal(false);

  // show modal for updating item details
  const openDetailsUpdateModal = () => {
    setDisplayMsg("Update item details?");
    setShowConfirmModal(true);
  };

  // show modal for updating item imgs
  const openImgsUpdateModal = (data) => {
    if (previewImageUrl.length > 0) {
      setUpdateType(1);
      setDisplayMsg("Add images to item collection?");
      setShowConfirmModal(true);
      setFormData(data);
    }
  };

  // confirmation for updating item details and updating item imgs
  const handleConfirmAction = async () => {
    setShowConfirmModal(false);
    switch (updateType) {
      case 0:
        // updating details
        updateDetails();
        break;
      case 1:
        // updating imgs
        updateImgs();
        break;
    }
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setUpdateType(null);
  };

  // create a preview
  const handleAddNewImage = (event) => {
    const uploaded_images = event.target.files;
    const totalImages =
      uploaded_images.length + previewImageUrl.length + currentImgs.length;

    if (totalImages <= 4) {
      for (let i = 0; i < uploaded_images.length; i++) {
        let prev_image_file_path = URL.createObjectURL(uploaded_images[i]);
        setPreviewImageUrl((prevItems) => [...prevItems, prev_image_file_path]);
      }
    } else {
      toast.error("Maximum of 4 images allowed");
    }

    event.target.value = "";
  };

  const onSubmit = (data) => {
    setUpdateType(0);
    setFormData(data);
    openDetailsUpdateModal();
  };

  const updateImgs = async () => {
    const totalImages = previewImageUrl.length + currentImgs.length;

    if (totalImages <= 4) {
      setImgUpdate(true);
      try {
        const response = await itemController.updateImgs(id, formData);
        if (response && response.data) {
          setCurrentImgs(response.data);
        }
      } catch (error) {
        // Incase of 408 Timeout error (Token Expiration), perform refresh
        try {
          if (error.response?.status === 408) {
            await handleRefresh();
            return updateImgs();
          }
          // display error message
          toast.error(handleErrMsg(error).msg);
        } catch (error) {
          // if error while refreshing, logout and delete all cookies
          logout();
        }
      }
    } else {
      toast.error("Maximum of 4 images allowed");
    }
    setImgUpdate(false);
    setUpdateType(null);
    setPreviewImageUrl([]);
  };

  const updateDetails = async () => {
    setDetailsUpdate(true);
    try {
      await itemController.update(id, formData);
    } catch (error) {
      // Incase of 408 Timeout error (Token Expiration), perform refresh
      try {
        if (error.response?.status === 408) {
          await handleRefresh();
          return updateDetails();
        }
        // display error message
        toast.error(handleErrMsg(error).msg);
      } catch (error) {
        // if error while refreshing, logout and delete all cookies
        logout();
      }
    }
    setDetailsUpdate(false);
    setUpdateType(null);
  };

  const buildDetailsForm = () => {
    return (
      <Form className="bg-light p-4 rounded-4 border border-2">
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
              type="number"
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

          <Form.Group
            className="my-2 my-sm-3"
            as={Col}
            sm="6"
            controlId="discount"
          >
            <Form.Label>Discount (%)</Form.Label>
            <Form.Control
              required
              type="number"
              placeholder="Discount..."
              {...register("discount")}
            />
            <ErrorMessage source={errors.discount} />
          </Form.Group>
        </Row>
        <div className="text-center">
          <Button
            variant="outline-primary"
            type="submit"
            size="lg"
            onClick={handleSubmit(onSubmit)}
          >
            {detailsUpdate && <ThreeDotLoading color={"#ffffff"} />}
            {!detailsUpdate && `Update`}
          </Button>
        </div>
      </Form>
    );
  };

  const buildImgsForm = () => {
    return (
      <Form className="bg-light p-4 rounded-4 border border-2 container">
        <Row className="mb-3">
          <Form.Group as={Col} sm="6" className="my-2 my-sm-3">
            <h2 className="mb-4">
              Current{" "}
              <span
                className="text-primary"
                style={{ fontFamily: "Abril Fatface" }}
              >
                Images
              </span>
            </h2>
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              {currentImgs.length > 0 &&
                currentImgs.map((img, index) => {
                  return (
                    <PrevImg className={`border rounded`} key={index}>
                      <ImageComponent
                        image={img}
                        width={"100%"}
                        height={"100%"}
                      />
                      {!imgUpdate && (
                        <BiTrashAlt
                          onClick={() => {
                            openImgConfirmModal(img, true, index);
                          }}
                          size={25}
                          className={`delete_icon`}
                        />
                      )}
                    </PrevImg>
                  );
                })}
            </div>
          </Form.Group>

          <Form.Group className="my-2 my-sm-3" as={Col} sm="6" controlId="">
            <h2 className="mb-4">
              Upload{" "}
              <span
                className="text-danger"
                style={{ fontFamily: "Abril Fatface" }}
              >
                Images
              </span>
            </h2>
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
                    const files = Array.from(e.target.files); // puts the image in an array
                    field.onChange(files); // Update form state
                    handleAddNewImage(e); // add the new image
                  }}
                  isInvalid={!!errors.image_upload} // Show invalid state if there are errors
                />
              )}
            />
            <div className="row m-2 gap-3">
              {previewImageUrl.length > 0 &&
                previewImageUrl.map((img, index) => {
                  return (
                    <PrevImg className={`border rounded`} key={index}>
                      <img
                        className="prev_img"
                        height={"100%"}
                        src={img}
                        width={"100%"}
                        alt=""
                      />
                      <BiTrashAlt
                        onClick={() => {
                          openImgConfirmModal(img, null, index);
                        }}
                        size={25}
                        className="delete_icon"
                      />
                    </PrevImg>
                  );
                })}
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit(openImgsUpdateModal)}
              className={`${imgUpdate === true ? "disabled" : ""}`}
            >
              {imgUpdate && <ThreeDotLoading color={"#ffffff"} />}
              {!imgUpdate && `Update`}
            </Button>
          </Form.Group>
        </Row>
      </Form>
    );
  };

  const buildSkeletonDetailsForm = () => {
    buildSkeletonImgsForm;
    return (
      <Form className="bg-light p-4 rounded-4 border border-2">
        <Row className="mb-3">
          <Form.Group
            className="my-2 my-sm-3"
            as={Col}
            sm="6"
            controlId="product_name"
          >
            <Skeleton width={100} />
            <Skeleton width={"100%"} />
          </Form.Group>

          <Form.Group
            className="my-2 my-sm-3"
            as={Col}
            sm="6"
            controlId="price"
          >
            <Skeleton width={100} />
            <Skeleton width={"100%"} />
          </Form.Group>

          <Form.Group
            className="my-2 my-sm-3"
            as={Col}
            sm="6"
            controlId="category"
          >
            <Skeleton width={100} />
            <Skeleton width={"100%"} />
          </Form.Group>

          <Form.Group
            className="my-2 my-sm-3"
            as={Col}
            sm="6"
            controlId="available"
          >
            <Skeleton width={100} />
            <Skeleton width={"100%"} />
          </Form.Group>

          <Form.Group
            className="my-2 my-sm-3"
            as={Col}
            sm="6"
            controlId="description"
          >
            <Skeleton width={100} />
            <Skeleton width={"100%"} />
          </Form.Group>

          <Form.Group
            className="my-2 my-sm-3"
            as={Col}
            sm="6"
            controlId="discount"
          >
            <Skeleton width={100} />
            <Skeleton width={"100%"} />
          </Form.Group>
        </Row>
        <div className="text-center">
          <Button variant="outline-primary disabled" type="submit" size="lg">
            <Skeleton width={100} />
          </Button>
        </div>
      </Form>
    );
  };

  const buildSkeletonImgsForm = () => {
    return (
      <Form className="bg-light p-4 rounded-4 border border-2 container">
        <Row className="mb-3">
          <Form.Group as={Col} sm="6" className="my-2 my-sm-3">
            <h2 className="mb-4">
              Current{" "}
              <span
                className="text-primary"
                style={{ fontFamily: "Abril Fatface" }}
              >
                Images
              </span>
            </h2>
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              {new Array(4).fill(1).map(() => {
                return (
                  <Skeleton
                    count={1}
                    width={100}
                    height={100}
                    key={Math.random()}
                  />
                );
              })}
            </div>
          </Form.Group>

          <Form.Group className="my-2 my-sm-3" as={Col} sm="6" controlId="">
            <h2 className="mb-4">
              Upload{" "}
              <span
                className="text-danger"
                style={{ fontFamily: "Abril Fatface" }}
              >
                Images
              </span>
            </h2>
            <Form.Label>Select Image Upload</Form.Label>
            <Controller
              name="image_upload"
              control={control}
              render={({ field }) => <Skeleton />}
            />
            <Button variant="disabled" size="lg">
              <Skeleton width={100} />
            </Button>
          </Form.Group>
        </Row>
      </Form>
    );
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
        {!networkRequest && buildDetailsForm()}
        {networkRequest && buildSkeletonDetailsForm()}

        <hr className="my-4" />

        {!networkRequest && buildImgsForm()}
        {networkRequest && buildSkeletonImgsForm()}
        <ImgConfirmDialogComp
          show={showImgConfirmModal}
          handleClose={closeImgConfirmModal}
          handleConfirm={handleImgConfirmAction}
          message={displayMsg}
          onlineFetch={onlineFetch}
          img={imgToRemove}
        />

        <ConfirmDialogComp
          show={showConfirmModal}
          handleClose={closeConfirmModal}
          handleConfirm={handleConfirmAction}
          message={displayMsg}
        />
      </div>
    </>
  );
};

export default ViewItemsDetails;
