import React from "react";
import HomeCarousel from "../Components/HomeCarousel";
import IMAGES from "../images/images";

const Home = () => {
	return (
		<>
			<div className="container-fluid bg-light">
				<div className="container">
					<HomeCarousel />
				</div>
				<div className="container my-4">
					<div className="container text-center my-5 py-3" id="showcase-1">
						<h1 className="">Top Categories</h1>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
							blandit <br /> massa enim Nullam nunc varius.
						</p>
					</div>
					<div className="row">
						<div className="col-12 col-md-6 p-2">
							<div
								className="d-flex gap-3 bg-danger-subtle p-4 rounded align-items-center"
								style={{ height: "270px" }}
							>
								<div>
									<span>Top Pick</span>
									<h1 className="display-5 ">Glasses</h1>
									<small>
										<a className="link link-danger" href="#">
											View Collection
										</a>
									</small>
								</div>
								<div>
									<img
										src={IMAGES.glasses11}
										width={"100%"}
										className="img-fluid"
										alt=""
									/>
								</div>
							</div>
						</div>
						<div className="col-12 col-md-6 p-2">
							<div
								className="d-flex gap-3 bg-info-subtle p-4 rounded align-items-center"
								style={{ height: "270px" }}
							>
								<div>
									<span>Top Pick</span>
									<h1 className="display-5 ">Footwares</h1>
									<small>
										<a className="link link-danger" href="#">
											View Collection
										</a>
									</small>
								</div>
								<div>
									<img
										src={IMAGES.shoe1}
										width={"100%"}
										className="img-fluid"
										alt=""
									/>
								</div>
							</div>
						</div>
						<div className="col-12 col-md-6 p-2">
							<div
								className="d-flex gap-3 bg-success-subtle p-4 rounded align-items-center"
								style={{ height: "270px" }}
							>
								<div>
									<span>Top Pick</span>
									<h1 className="display-5 ">Belts</h1>
									<small>
										<a className="link link-danger" href="#">
											View Collection
										</a>
									</small>
								</div>
								<div>
									<img
										src={IMAGES.belt1}
										width={"100%"}
										className="img-fluid"
										alt=""
									/>
								</div>
							</div>
						</div>
						<div className="col-12 col-md-6 p-2">
							<div
								className="d-flex gap-3 bg-warning-subtle p-4 rounded align-items-center"
								style={{ height: "270px" }}
							>
								<div>
									<span>Top Pick</span>
									<h1 className="display-5 ">Shirts</h1>
									<small>
										<a className="link link-danger" href="#">
											View Collection
										</a>
									</small>
								</div>
								<div>
									<img
										src={IMAGES.shirt1}
										width={"100%"}
										className="img-fluid"
										alt=""
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="container">
					<h1 className="display-5  text-center">Recommended Products</h1>
					<div className="row">
						<div className="col-4"></div>
						<div className="col-4"></div>
						<div className="col-4"></div>
						<div className="col-4"></div>
						<div className="col-4"></div>
						<div className="col-4"></div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;
