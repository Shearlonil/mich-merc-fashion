import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BiLinkAlt } from "react-icons/bi";
import { toast } from "react-toastify";

import { capitalizeFirstLetter } from "../Utils/helpers";
import CardCarousell from "./CardCarousel";
import itemController from "../controllers/item-controller";
import handleErrMsg from "../Utils/error-handler";
import { CardTitle } from "react-bootstrap";

const CategoryPrev = ({ catInfo, catTitle }) => {
  const [networkRequest, setNetworkRequest] = useState(false);
  const [catItems, setCatItems] = useState([]);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      setNetworkRequest(true);
      const response = await itemController.fetchRecentItemsByCat(8, 1);

      setCatItems(response.data);
      setNetworkRequest(false);
    } catch (error) {
      setNetworkRequest(false);
      // display error message
      toast.error(handleErrMsg(error).msg);
    }
  };

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
        {<CardCarousell cards={catItems} key={CardTitle} />}
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
