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

const noItemFound = () => {
  const cardProp = {
    desc: "",
    title: "No Item Found",
    ItemImages: [
      {
        file_name: "logo.png",
        blur_hash: "UZA2ooV?V=RQp3X9o#oyM+n$jbWXVpjbWCa|",
      },
    ],
    price: 0,
  };
  return <ProductCard productInfo={cardProp} />;
};

const CardCarousell = ({ cards }) => {
  let isSingleItem = cards === null || cards.length < 2 ? true : false;

  return (
    <div className="container">
      <Carousel
        responsive={responsive}
        infinite={!isSingleItem}
        autoPlay={!isSingleItem}
        autoPlaySpeed={4000}
        customTransition="all 1s"
        transitionDuration={500}
      >
        {cards === null
          ? new Array(4).fill(1).map((index) => <CardSkeleton key={index} />)
          : cards.length === 0
          ? noItemFound()
          : cards.map((card, index) => (
              <ProductCard productInfo={card} key={index} />
            ))}
      </Carousel>
    </div>
  );
};

export default CardCarousell;
