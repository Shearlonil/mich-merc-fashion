import IMAGES from "./src/images/images";

const SHOP_DATA = {
	shoes: [
		{
			id: 0,
			name: "Brown Brim",
			imageUrl: IMAGES.shoe1,
			price: 25,
		},
		{
			id: 1,
			name: "Blue Beanie",
			imageUrl: IMAGES.shoe2,
			price: 18,
		},
		{
			id: 2,
			name: "Brown Cowboy",
			imageUrl: IMAGES.shoe3,
			price: 35,
		},
		{
			id: 3,
			name: "Grey Brim",
			imageUrl: IMAGES.shoe4,
			price: 25,
		},
		{
			id: 4,
			name: "Green Beanie",
			imageUrl: IMAGES.shoe5,
			price: 18,
		},
		{
			id: 5,
			name: "Palm Tree Cap",
			imageUrl: IMAGES.shoe6,
			price: 14,
		},
		{
			id: 6,
			name: "Red Beanie",
			imageUrl: IMAGES.shoe7,
			price: 18,
		},
		{
			id: 7,
			name: "Wolf Cap",
			imageUrl: IMAGES.shoe8,
			price: 14,
		},
		{
			id: 8,
			name: "Blue Snapback",
			imageUrl: IMAGES.shoe9,
			price: 16,
		},
	],
	glasses: [
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
		{
			id: 13,
			name: "Nike Red High Tops",
			imageUrl: "https://i.ibb.co/QcvzydB/nikes-red.png",
			price: 160,
		},
		{
			id: 14,
			name: "Nike Brown High Tops",
			imageUrl: "https://i.ibb.co/fMTV342/nike-brown.png",
			price: 160,
		},
		{
			id: 15,
			name: "Air Jordan Limited",
			imageUrl: "https://i.ibb.co/w4k6Ws9/nike-funky.png",
			price: 190,
		},
		{
			id: 16,
			name: "Timberlands",
			imageUrl: "https://i.ibb.co/Mhh6wBg/timberlands.png",
			price: 200,
		},
	],
	belts: [
		{
			id: 17,
			name: "Black Jean Shearling",
			imageUrl: "https://i.ibb.co/XzcwL5s/black-shearling.png",
			price: 125,
		},
		{
			id: 18,
			name: "Blue Jean Jacket",
			imageUrl: "https://i.ibb.co/mJS6vz0/blue-jean-jacket.png",
			price: 90,
		},
		{
			id: 19,
			name: "Grey Jean Jacket",
			imageUrl: "https://i.ibb.co/N71k1ML/grey-jean-jacket.png",
			price: 90,
		},
		{
			id: 20,
			name: "Brown Shearling",
			imageUrl: "https://i.ibb.co/s96FpdP/brown-shearling.png",
			price: 165,
		},
		{
			id: 21,
			name: "Tan Trench",
			imageUrl: "https://i.ibb.co/M6hHc3F/brown-trench.png",
			price: 185,
		},
	],
	shirts: [
		{
			id: 22,
			name: "Blue Tanktop",
			imageUrl: "https://i.ibb.co/7CQVJNm/blue-tank.png",
			price: 25,
		},
		{
			id: 23,
			name: "Floral Blouse",
			imageUrl: "https://i.ibb.co/4W2DGKm/floral-blouse.png",
			price: 20,
		},
		{
			id: 24,
			name: "Floral Dress",
			imageUrl: "https://i.ibb.co/KV18Ysr/floral-skirt.png",
			price: 80,
		},
		{
			id: 25,
			name: "Red Dots Dress",
			imageUrl: "https://i.ibb.co/N3BN1bh/red-polka-dot-dress.png",
			price: 80,
		},
		{
			id: 26,
			name: "Striped Sweater",
			imageUrl: "https://i.ibb.co/KmSkMbH/striped-sweater.png",
			price: 45,
		},
		{
			id: 27,
			name: "Yellow Track Suit",
			imageUrl: "https://i.ibb.co/v1cvwNf/yellow-track-suit.png",
			price: 135,
		},
		{
			id: 28,
			name: "White Blouse",
			imageUrl: "https://i.ibb.co/qBcrsJg/white-vest.png",
			price: 20,
		},
	],
};

const categoryMap = ["shoes", "glasses", "belts", "shirts"];

const categoryOptions = [
	{ value: "shoes", label: "Shoes" },
	{ value: "belts", label: "Belts" },
	{ value: "shirt", label: "Shirt" },
	{ value: "glasses", label: "Glasses" },
];
const availabilityOptions = [
	{ value: "in-stock", label: "In-Stock" },
	{ value: "out-of-stock", label: "Out-Of-Stock" },
];


const countryOptions = [
	{ value: "chocolate", label: "Chocolate" },
	{ value: "strawberry", label: "Strawberry" },
	{ value: "vanilla", label: "Vanilla" },
	{ value: "vanilla", label: "Vanilla" },
];

export {
	SHOP_DATA,
	categoryMap,
	categoryOptions,
	availabilityOptions,
	countryOptions,
};
