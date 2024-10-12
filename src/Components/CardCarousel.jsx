import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ProductCard from "./ProductCard";
import CardSkeleton from "./CardSkeleton";

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
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={4000}
        customTransition="all 1s"
        transitionDuration={500}
      >
        {cards.length === 0
          ? new Array(4).fill(1).map(() => <CardSkeleton />)
          : cards.map((card, index) => (
              <ProductCard productInfo={card} key={index} />
            ))}
      </Carousel>
    </div>
  );
};

export default CardCarousell;
