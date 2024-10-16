import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import { capitalizeFirstLetter } from "../Utils/helpers";
import handleErrMsg from "../Utils/error-handler";
import ProductCard from "../Components/ProductCard";
import itemController from "../controllers/item-controller";
import CardSkeleton from "../Components/CardSkeleton";
import PaginationLite from "../Components/PaginationLite";

const Category = () => {
  const { category } = useParams();
  const [catItems, setCatItems] = useState([]);
  const [networkRequest, setNetworkRequest] = useState(false);

  // for pagination
  const [pageSize] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxID, setMaxID] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  //  data returned from DataPagination
  const [pagedData, setPagedData] = useState([]);

  useEffect(() => {
    initialize();
  }, [category]);

  const initialize = async () => {
    try {
      setNetworkRequest(true);
      setPagedData([]);
      const response = await itemController.fetchRecentItemsByCatName(
        pageSize,
        category
      );

      setCatItems(response.data.rows);
      setPagedData(response.data.rows);
      setTotalItems(response.data.count);
      setMaxID(response.data.rows[response.data.rows.length - 1].id);
      setNetworkRequest(false);
    } catch (error) {
      // display error message
      toast.error(handleErrMsg(error).msg);
      setNetworkRequest(false);
    }
  };

  const setPageChanged = async (pageNumber) => {
    const startIndex = (pageNumber - 1) * pageSize;
    if (pageNumber === 1) {
      const arr = catItems.slice(startIndex, startIndex + pageSize);
      setPagedData(arr);
    } else {
      if (catItems.length > startIndex) {
        const arr = catItems.slice(startIndex, startIndex + pageSize);

        setPagedData(arr);
      } else {
        paginateFetch(pageNumber, pageNumber - currentPage);
      }
    }
  };

  const paginateFetch = async (pageNumber, pageSpan) => {
    try {
      setNetworkRequest(true);
      setPagedData([]);
      const response = await itemController.paginateItemsByCatName(
        pageSize,
        category,
        maxID,
        pageSpan
      );

      //  check if the request to fetch indstries doesn't fail before setting values to display
      if (response && response.data) {
        setMaxID(response.data[response.data.length - 1].id);
        setCatItems([...catItems, ...response.data]);
        /*  normally, we would call setPagedData(response.data.catItems) here but that isn't necessary because calling setCurrentPage(pageNumber)
			would cause PaginationLite to re-render as currentPage is part of it's useEffect dependencies. This re-render triggers setPageChanged to be
			called with currentPage number. the 'else if' block then executes causing setPagedData to be set  */
        setCurrentPage(pageNumber);
      }
      // update page number
      setNetworkRequest(false);
    } catch (error) {
      // Incase of 408 Timeout error (Token Expiration), perform refresh
      try {
        if (error.response?.status === 408) {
          await handleRefresh();
          return paginateFetch(pageNumber, pageSpan);
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
          new Array(4).fill(1).map((data, index) => (
            <div className="col-12 col-md-6 col-xl-3" key={index * data}>
              <CardSkeleton />
            </div>
          ))}
        {pagedData.length > 0 &&
          pagedData.map((info, index) => (
            <div key={index + info} className="col-12 col-md-6 col-xl-3">
              <ProductCard productInfo={info} key={index * index} />
            </div>
          ))}
        {!networkRequest && catItems.length === 0 && noItemFound()}
      </div>
      <PaginationLite
        itemCount={totalItems}
        pageSize={pageSize}
        setPageChanged={setPageChanged}
        pageNumber={currentPage}
      />
    </div>
  );
};

export default Category;
