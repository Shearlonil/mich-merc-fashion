import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BiLinkAlt } from "react-icons/bi";
import { toast } from "react-toastify";

import { capitalizeFirstLetter } from "../Utils/helpers";
import CardCarousell from "./CardCarousel";
import itemController from "../controllers/item-controller";
import handleErrMsg from "../Utils/error-handler";
import { CardTitle } from "react-bootstrap";

const CategoryPrev = ({ catTitle }) => {
  const [catItems, setCatItems] = useState(null);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      const response = await itemController.fetchRecentItemsByCatName(
        8,
        catTitle
      );

      setCatItems(response.data);
    } catch (error) {
      // display error message
      toast.error(handleErrMsg(error).msg);
    }
  };

  return (
    <div className="container mt-4">
      <Link className="btn" to={`${catTitle}`}>
        <h2 className="text-black-emphasis display-5 fw-normal">
          {catTitle}
          <BiLinkAlt
            size={35}
            className="text-secondary bg-light rounded-circle"
          />
        </h2>
      </Link>

      <div className="row">
        {<CardCarousell cards={catItems} key={CardTitle} />}
        <div className="text-center">
          <Link
            className="btn btn-outline-danger rounded-pill poppins"
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
