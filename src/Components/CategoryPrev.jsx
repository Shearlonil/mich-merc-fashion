import React from "react";
import { Link } from "react-router-dom";
import { capitalizeFirstLetter } from "../Utils/helpers";
import { BiLinkAlt } from "react-icons/bi";
import CardCarousell from "./CardCarousel";

const CategoryPrev = ({ catInfo, catTitle }) => {
  // make network request here
  return (
    <div className="container mt-4">
      <Link className="btn" to={`${catTitle}`}>
        <h2 className="text-black-emphasis display-5 fw-normal">
          {capitalizeFirstLetter(catTitle)}
          <BiLinkAlt
            size={35}
            className="text-secondary bg-light rounded-circle"
          />
        </h2>
      </Link>

      <div className="row">
        {<CardCarousell cards={catInfo} />}
        <div className="text-center">
          <Link
            className="btn btn-outline-danger  rounded-pill poppins"
            to={`${catTitle}`}
          >
            View More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryPrev;
