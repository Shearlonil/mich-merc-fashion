import React from "react";
import CategoryPrev from "../Components/CategoryPrev";
import { categoryMap } from "../../data";

const Shop = () => {
  return (
    <div>
      {categoryMap.map((catTitle, index) => {
        return <CategoryPrev catTitle={catTitle} key={index} />;
      })}
    </div>
  );
};

export default Shop;
