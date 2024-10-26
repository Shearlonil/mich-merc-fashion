import React from "react";
import styled from "styled-components";
import numeral from "numeral";
import { BsArrowRight } from "react-icons/bs";

import ImageComponent from "./ImageComponent";
import EllipsisText from "./EllipsisText";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  width: 100%;
  border: 1;
`;

const SemiProductCard = ({ id, cat_name, discount, title, img, price }) => {
  const navigate = useNavigate();

  const displayDiscount = () => {
    return (
      <div className="d-flex justify-content-between w-100 align-items-center ps-1 pe-1">
        <h5 className="poppins">
          <span className="poppins text-dark">
            £
            {numeral(price)
              .subtract(numeral(discount).divide(100).multiply(price).value())
              .format("£0,0.00")}
          </span>
        </h5>
        <>
          <span className={`text-danger ${discount > 0.0 ? "strike" : ""}`}>
            <span className="text-dark">£{numeral(price).value()}</span>
          </span>
        </>
      </div>
    );
  };

  const displayPrice = () => {
    return (
      <h5>
        <span className="poppins text-dark ps-1 pe-1">
          £{numeral(price).value()}
        </span>
      </h5>
    );
  };

  return (
    <div onClick={() => navigate(`/product/${id}`)}>
      <div
        className="d-flex flex-column justify-content-between border p-3"
        style={{ height: "20rem", minWidth: "10rem" }}
      >
        <small className="poppins">{cat_name}</small>
        <h5 className="fw-normal">
          <EllipsisText
            styles={{ style: { fontFamily: "Abril Fatface" } }}
            message={title}
            maxLength={10}
            clickable={false}
          />
        </h5>
        <ImageComponent image={img} height={130} />
        <div className="d-flex justify-content-between">
          {discount > 0 && displayDiscount()}
          {discount == 0 && displayPrice()}
        </div>

        {/* <button
          onClick={() => navigate(`/product/${id}`)}
          className="d-flex align-item-center justify-content-center btn btn-outline-dark py-1 px-2 rounded-circle"
        >
          <BsArrowRight />
        </button> */}
      </div>
    </div>
  );
};

export default SemiProductCard;
