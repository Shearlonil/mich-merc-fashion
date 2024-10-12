import React from "react";
import CategoryPrev from "../Components/CategoryPrev";
import { SHOP_DATA } from "../../data";

const Shop = () => {
  return (
    <div>
      {Object.entries(SHOP_DATA).map(([cat, items], index) => {
        return <CategoryPrev catInfo={items} catTitle={cat} />;
      })}
    </div>
  );
};

export default Shop;
