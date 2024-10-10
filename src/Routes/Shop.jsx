import React from 'react'
import Category from "./Category";
import CategoryPrev from '../Components/CategoryPrev'
import { categoryMap, SHOP_DATA } from '../../data'

const Shop = () => {
  return (
		<div>
			{/* {categoryMap.map((title, index) => (
        <CategoryPrev key={index} catTitle={title}/>
      ))} */}
      {Object.entries(SHOP_DATA).map(([cat, items], index) => {
        return <CategoryPrev catInfo={items} catTitle={cat} />
      })}
		</div>
	);
}

export default Shop