import React from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { SHOP_DATA } from "../../data";
import { capitalizeFirstLetter } from "../Utils/helpers";

const ViewItems = () => {
	return (
		<>
			<div className="container my-5">
				<h2 className="paytone-one text-success">Products</h2>

				<Table striped className="border" responsive="sm">
					<thead>
						<tr>
							<th>#</th>
							<th>Product</th>
							<th>Categories</th>
							<th>Available</th>
							<th>Date</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{Object.entries(SHOP_DATA).map(([cat, items], index) => {
							return items.map(({ name }, index) => {
								return (
									<tr>
										<td>{index}</td>
										<td>{name}</td>
										<td>{capitalizeFirstLetter(cat)}</td>
										<td>
											<span className="text-danger fw-bold">none</span>
										</td>
										<td>01/10/2024</td>
										<th>
											<Link to={"details"}>View</Link>
										</th>
									</tr>
								);
							});
						})}
						{/* <tr>
							<td>1</td>
							<td>John Doe</td>
							<td>johndoe@gmail.com</td>
							<td>07012345678</td>
							<th>
								<Link to={"details"}>View</Link>
							</th>
						</tr>
						<tr>
							<td>2</td>
							<td>John Doe</td>
							<td>johndoe@gmail.com</td>
							<td>07012345678</td>
							<th>
								<Link to={"details"}>View</Link>
							</th>
						</tr>
						<tr>
							<td>3</td>
							<td>John Doe</td>
							<td>johndoe@gmail.com</td>
							<td>07012345678</td>
							<th>
								<Link to={"details"}>View</Link>
							</th>
						</tr> */}
					</tbody>
				</Table>
			</div>
		</>
	);
};

export default ViewItems;
