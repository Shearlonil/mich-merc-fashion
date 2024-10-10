import React from 'react'
import ProductCard from './ProductCard'
import { Navigate, useParams } from 'react-router-dom';
import { categoryMap, SHOP_DATA } from '../../data';
import { capitalizeFirstLetter } from '../Utils/helpers';

const Category = () => {
	const { category } = useParams();
	const catInfo =SHOP_DATA[category]

  return (
		<div className="container mt-4">
			{categoryMap.includes(category) ? (
				<>
					<h2 className='display-5 oswald fw-bold text-center'>{capitalizeFirstLetter(category)}</h2>
					<div className="row">
						{/* {Array.from({ length: 4 }).map((_, index) => ( */}
						{catInfo.map((info, index) => (
							<div key={index} className="col-12 col-md-6 col-xl-3">
								<ProductCard productInfo={info} myIndex={index} />
							</div>
						))}
					</div>
				</>
			) : (
				<Navigate to={"/shop"} />
			)}
		</div>
	);
}

export default Category;