import React from "react";
import CategoryPrev from "../Components/CategoryPrev";
import { SHOP_DATA } from "../../data";

const Shop = () => {
  return (
    <div>
      {Object.entries(SHOP_DATA).map(([catTitle, items], index) => {
        return <CategoryPrev catInfo={items} catTitle={catTitle} key={index} />;
      })}
    </div>
  );
};

export default Shop;
