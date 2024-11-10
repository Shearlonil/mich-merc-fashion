import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

import ConfirmDialogComp from "../Components/ConfirmDialogComp";
import { ThreeDotLoading } from "../Components/react-loading-indicators/Indicator";
import { useAuth } from "../app-context/auth-user-context";
import handleErrMsg from "../Utils/error-handler";
import genericController from "../controllers/generic-controller";
import staffController from "../controllers/staff-controller";

import editorSchema from "../Utils/quill-schema";
import Editor from "../Components/quill/quill-editor";
import Quill from "quill";
import Ajv from "ajv";

const Delta = Quill.import("delta");

const ReviewTermsAndAgreement = () => {
  const ajv = new Ajv({ allErrors: true }); // options can be passed, e.g. {allErrors: true}
  const navigate = useNavigate();

  const { handleRefresh, logout } = useAuth();

  // Use a ref to access the quill instance directly
  const quillRef = useRef();
  const [networkRequest, setNetworkRequest] = useState(true);
  const [termsAndAgreeement, setTermsAndAgreement] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [displayMsg, setDisplayMsg] = useState("");

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      setNetworkRequest(true);
      const urls = ["/terms/get"];
      const response = await genericController.performGetRequests(urls);
      const { 0: terms } = response;

      //  check if the request to fetch locations doesn't fail before setting values to display
      if (terms && terms.data) {
        setNetworkRequest(false);
        setTermsAndAgreement(terms.data);
        const quillData = JSON.parse(terms.data.value);
        // const quillData = terms.data.value;
        let content = new Delta();
        quillData.forEach((element) => {
          content.insert(element.insert, element.attributes);
        });
        quillRef.current.setContents(content);
      }
      setNetworkRequest(false);
    } catch (error) {
      // Incase of 408 Timeout error (Token Expiration), perform refresh
      try {
        if (error.response?.status === 408) {
          await handleRefresh();
          return initialize();
        }
        // Incase of 401 Unauthorized, navigate to 404
        if (error.response?.status === 401) {
          navigate("/dashboard");
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

  const handleOpenModal = () => {
    setDisplayMsg("Update Terms and Conditions");
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleConfirmAction = async () => {
    setShowModal(false);
    try {
      setNetworkRequest(true);
      const { ops } = quillRef.current.getContents();
      const isValid = ajv.validate(editorSchema, ops);
      if (!isValid) {
        toast.error("Please enter/edit Terms and Conditions");
      } else {
        await staffController.updateTermsAndAgreement(ops);
      }
      toast.info("Terms and Conditions updated successfully");
      setNetworkRequest(false);
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
      setNetworkRequest(false);
    }
  };

  return (
    <div className="container mt-2">
      <h1 className="text-center">
        Terms{" "}
        <span className="text-primary" style={{ fontFamily: "Abril Fatface" }}>
          and
        </span>{" "}
        Conditions
      </h1>
      <div className="d-flex gap-3 align-items-center text-muted">
        Last Updated:
        {termsAndAgreeement?.value && (
          <small className="">
            {formatDistanceToNow(termsAndAgreeement.updatedAt, {
              addSuffix: true,
            })}
          </small>
        )}
      </div>
      <hr />
      <div id="body" className="mb-3">
        <Editor ref={quillRef} />
      </div>
      <Button
        variant=""
        className="btn-outline-success"
        onClick={() => handleOpenModal()}
        disabled={networkRequest}
      >
        Update
        {networkRequest && (
          <ThreeDotLoading color="#ffffff" size="small" variant="pulsate" />
        )}
      </Button>
      <ConfirmDialogComp
        show={showModal}
        handleClose={handleCloseModal}
        handleConfirm={handleConfirmAction}
        message={displayMsg}
      />
    </div>
  );
};

export default ReviewTermsAndAgreement;
