import React, { useEffect, useState } from "react";
import { SHOP_DATA } from "../../data";
import { useNavigate } from "react-router-dom";

const Cart = () => {
	const navigate = useNavigate();

	const [cartObject, setCartObject] = useState([
		{
			id: 9,
			name: "Adidas NMD",
			imageUrl: "https://i.ibb.co/0s3pdnc/adidas-nmd.png",
			price: 220,
		},
		{
			id: 10,
			name: "Adidas Yeezy",
			imageUrl: "https://i.ibb.co/dJbG1cT/yeezy.png",
			price: 280,
		},
		{
			id: 11,
			name: "Black Converse",
			imageUrl: "https://i.ibb.co/bPmVXyP/black-converse.png",
			price: 110,
		},
		{
			id: 12,
			name: "Nike White AirForce",
			imageUrl: "https://i.ibb.co/1RcFPk0/white-nike-high-tops.png",
			price: 160,
		},
	]);

	// useEffect(() => {
	// 	setCartObject(SHOP_DATA.glasses);
	// }, [cartObject]);

	let total = 0;

	return (
		<div className="container">
			<h1>Cart</h1>
			<table
				className="table mx-auto"
				style={{ width: "800px", maxWidth: "100%" }}
			>
				<thead>
					<tr>
						<th style={{ padding: "10px 20px" }} scope="col">
							#
						</th>
						<th style={{ padding: "10px 20px" }} scope="col">
							First
						</th>
						<th style={{ padding: "10px 20px" }} scope="col">
							Last
						</th>
						<th style={{ padding: "10px 20px" }} scope="col">
							Handle
						</th>
					</tr>
				</thead>
				<tbody>
					{cartObject ? (
						cartObject.map(({ id, name, imageUrl, price }, index) => {
							total += price;
							return (
								<tr key={id} className="">
									<th style={{ padding: "20px" }} scope="row">
										<button
											type="button"
											className="btn-close"
											aria-label="Close"
										></button>
									</th>
									<td style={{ padding: "20px" }}>
										<img
											src={imageUrl}
											width={"100px"}
											height={"100px"}
											alt=""
										/>
									</td>
									<td style={{ padding: "20px" }}>{name}</td>
									<td style={{ padding: "20px" }}>${price}</td>
								</tr>
							);
						})
					) : (
						<h3 className="text-muted">No items in cart</h3>
					)}
				</tbody>
			</table>
			<div className="my-3 text-center P-3">
				<div className="text-center">
					<p className="m-0 fs-2">Total</p>
					<span className="fs-4">${total}</span>
				</div>
				<button
					className="btn btn-lg btn-outline-danger px-3 rounded-pill"
					onClick={() => navigate("checkout")}
				>
					Proceed to Checkout
				</button>
			</div>
		</div>
	);
};

export default Cart;
