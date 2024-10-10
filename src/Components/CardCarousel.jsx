import React from "react";
import { Card, Col } from "react-bootstrap";
import { GrAdd } from "react-icons/gr";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
// import WordSpan from "./WordSpan";

const responsive = {
	superLargeDesktop: {
		// the naming can be any, depends on you.
		breakpoint: { max: 4000, min: 3000 },
		items: 5,
	},
	desktop: {
		breakpoint: { max: 3000, min: 1024 },
		items: 4,
	},
	tablet: {
		breakpoint: { max: 1024, min: 464 },
		items: 3,
	},
	mobile: {
		breakpoint: { max: 464, min: 0 },
		items: 1,
	},
};

const CardCarousell = ({ cards, title }) => {
	return (
		<div className="container">
			<h1 className="display-5 text-light text-center noto-sans-font">
				{/* <WordSpan>What</WordSpan> we do */}
			</h1>
			<Carousel
				responsive={responsive}
				infinite={true}
				autoPlay={true}
				autoPlaySpeed={4000}
				customTransition="all 1s"
				transitionDuration={500}
			>
				{cards.slice(0, 5).map((card, index) => (
					<ProductCard productInfo={card} key={index} />
				))}
			</Carousel>
		</div>
	);
};

export default CardCarousell;
