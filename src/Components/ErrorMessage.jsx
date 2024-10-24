import React from "react";
import { Form } from "react-bootstrap";

const ErrorMessage = ({ source }) => {
  return (
    <>
      {source && (
        <span className="text-danger animate__animated animate__headShake animate__repeat-3 fs-6">
          {source.message}
        </span>
      )}
    </>
  );
};

export default ErrorMessage;
