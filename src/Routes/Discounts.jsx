import * as yup from "yup";
import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import ErrorMessage from "../Components/ErrorMessage";
import { useAuth } from "../app-context/auth-user-context";
import { ThreeDotLoading } from "../Components/react-loading-indicators/Indicator";
import handleErrMsg from "../Utils/error-handler";
import itemController from "../controllers/item-controller";

const Discount = () => {
  const [networkRequest, setNetworkRequest] = useState(false);

  const { handleRefresh, getCurrentYear, logout } = useAuth();

  const schema = yup.object().shape({
    discount: yup.number().required("Discount is required!"),
  });

  // Yup Integration with "react-hook-form"
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setNetworkRequest(true);
      await itemController.setGeneralDiscount(data.discount);
      setNetworkRequest(false);
    } catch (error) {
      // Incase of 408 Timeout error (Token Expiration), perform refresh
      try {
        if (error.response?.status === 408) {
          await handleRefresh();
          return onSubmit(data);
        }
        // display error message
        toast.error(handleErrMsg(error).msg);
      } catch (error) {
        // if error while refreshing, logout and delete all cookies
        logout();
      }
      setNetworkRequest(false);
      toast.error(handleErrMsg(error).msg);
    }
  };

  return (
    <div className="mt-auto mb-auto">
      <div className="align-self-center justify-self-center">
        <div className="container mx-auto">
          <main
            className="form-signin m-auto"
            style={{ minWidth: "320px", maxWidth: "350px" }}
          >
            <Form className="text-center text-dark">
              <img
                className="mb-4"
                src={logo}
                alt=""
                // width="90"
                height="120"
              />
              <h1 className="h3 mb-3 fw-normal">General Discount</h1>

              <div className="form-floating mb-3">
                <input
                  type="number"
                  className="form-control rounded-bottom-0 mb-1"
                  id="floatingInput"
                  placeholder=""
                  {...register("discount")}
                />
                <label htmlFor="floatingInput">general discount</label>
                <ErrorMessage source={errors.discount} />
              </div>
              <button
                className="btn btn-outline-secondary w-100 my-2 py-2"
                type="submit"
                onClick={handleSubmit(onSubmit)}
              >
                {networkRequest && (
                  <ThreeDotLoading
                    color="#0000ff"
                    size="medium"
                    text=""
                    textColor="#f78419"
                  />
                )}
                {!networkRequest && `Update Discounts`}
              </button>
              <p className="mb-3">&copy; {getCurrentYear()}</p>
            </Form>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Discount;
