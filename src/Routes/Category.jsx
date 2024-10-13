import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import { capitalizeFirstLetter } from "../Utils/helpers";
import handleErrMsg from "../Utils/error-handler";
import ProductCard from "../Components/ProductCard";
import itemController from "../controllers/item-controller";
import CardSkeleton from "../Components/CardSkeleton";

const Category = () => {
  const { category } = useParams();
  const [catItems, setCatItems] = useState([]);
  const [networkRequest, setNetworkRequest] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      setNetworkRequest(true);
      const response = await itemController.fetchRecentItemsByCatName(
        12,
        category
      );

      setCatItems(response.data);
      setNetworkRequest(false);
    } catch (error) {
      // display error message
      toast.error(handleErrMsg(error).msg);
      setNetworkRequest(false);
    }
  };

  const noItemFound = () => {
    const cardProp = {
      desc: "",
      title: "No Item Found",
      ItemImages: [
        {
          file_name: "logo.png",
          blur_hash: "UZA2ooV?V=RQp3X9o#oyM+n$jbWXVpjbWCa|",
        },
      ],
      price: 0,
    };
    return (
      <div className="col-12 col-md-6 col-xl-3">
        <ProductCard productInfo={cardProp} />
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <h2 className="display-5 oswald fw-bold text-center">
        {capitalizeFirstLetter(category)}
      </h2>
      <div className="row">
        {networkRequest &&
          new Array(4).fill(1).map((index) => (
            <div className="col-12 col-md-6 col-xl-3">
              <CardSkeleton key={index} />
            </div>
          ))}
        {catItems.length > 0 &&
          catItems.map((info, index) => (
            <div key={index} className="col-12 col-md-6 col-xl-3">
              <ProductCard productInfo={info} key={index} />
            </div>
          ))}
        {!networkRequest && catItems.length === 0 && noItemFound()}
      </div>
    </div>
  );
};

export default Category;
