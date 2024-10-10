import React from 'react'
import ProductCard from '../Components/ProductCard';

const Categories = () => {
  return (
		<div>
			{Array.from({ length: 40 }).map((_, index) => (
				<div className="col-3">
					<ProductCard key={index} myIndex={index} />
				</div>
			))}
		</div>
	);
}

export default Categories;