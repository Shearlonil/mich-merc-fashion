import React from "react";
import styled from "styled-components";
import numeral from "numeral";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import ImageComponent from "./ImageComponent";
import EllipsisText from "./EllipsisText";

const Wrapper = styled.div`
  width: 100%;
  border: 1;
`;

const ProductCard = ({ productInfo }) => {
  const { id, desc, discount, title, ItemImages, price } = productInfo;

  const displayDiscount = () => {
    return (
      <div>
        <h2 className="poppins mb-0">
          <span className="poppins text-dark fw-bold">
            £
            {numeral(price)
              .subtract(numeral(discount).divide(100).multiply(price).value())
              .format("£0,0.00")}
          </span>
        </h2>
        <>
          <span className={`text-danger ${discount > 0.0 ? "strike" : ""}`}>
            <span className="text-dark">£{price}</span>
          </span>
          {discount && discount > 0 && (
            <span className="ms-3 text-danger discount">
              -{numeral(discount).value()}%
            </span>
          )}
        </>
      </div>
    );
  };

  const displayPrice = () => {
    return (
      <h4 className="mb-0">
        <span>£{numeral(price).value()}</span>
      </h4>
    );
  };

  return (
    <Wrapper>
      <div>
        <Card
          style={{ minHeight: "400px", maxHeight: "400px" }}
          className="gap-0 m-2 border-0 rounded-1 bg-light"
        >
          {/* ItemImages is an array of images attached to the item. Select the first */}
          <ImageComponent image={ItemImages[0]} />
          <Card.Header>
            <h6 className="fw-boldmb-0" style={{ color: "#050580" }}>
              <EllipsisText
                styles={{ style: { fontFamily: "serif" } }}
                message={title}
                maxLength={30}
                clickable={false}
              />
            </h6>
          </Card.Header>
          <Card.Body className="d-flex flex-column justify-content-between">
            <Card.Title className="">
              {discount && discount > 0 && displayDiscount()}
              {discount && discount == 0 && displayPrice()}
            </Card.Title>
            {/* <Card.Text>
              <EllipsisText message={desc} maxLength={40} clickable={false} />
            </Card.Text> */}
            <div className="d-flex align-items-center justify-content-between">
              <Link
                to={`/product/${id}`}
                className={` w-100 btn btn-outline-primary rounded-pill ${
                  price === 0 ? "disabled" : ""
                }`}
              >
                View
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Wrapper>
  );
};

export default ProductCard;
