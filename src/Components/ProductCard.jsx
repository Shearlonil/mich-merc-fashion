import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import ImageComponent from "./ImageComponent";
import EllipsisText from "./EllipsisText";

const Wrapper = styled.div`
  width: 100%;
  border: 1;
`;

const ProductCard = ({ productInfo }) => {
  const { desc, title, ItemImages, price } = productInfo;

  return (
    <Wrapper>
      <div>
        <Card
          style={{ minHeight: "500px", maxHeight: "500px" }}
          className="gap-2 m-2 border-0 rounded-1 bg-light"
        >
          {/* ItemImages is an array of images attached to the item. Select the first */}
          <ImageComponent image={ItemImages[0]} />
          <Card.Header>
            <h4 className="fw-bold" style={{ color: "#050580" }}>
              <EllipsisText
                style={{ fontFamily: "serif" }}
                message={title}
                maxLength={30}
                clickable={false}
              />
            </h4>
          </Card.Header>
          <Card.Body className="d-flex flex-column justify-content-between">
            <Card.Title className="">
              <h4>
                <span>£{price}</span>
              </h4>
            </Card.Title>
            <Card.Text>
              <EllipsisText message={desc} maxLength={40} clickable={false} />
            </Card.Text>
            <div className="d-flex align-items-center justify-content-between">
              <Link
                to={"/product"}
                className={`btn btn-outline-danger rounded-pill ${
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
