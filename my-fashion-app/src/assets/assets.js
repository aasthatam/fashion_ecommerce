import Shirt1 from "../assets/shirt1.png";
import Shirt2 from "../assets/shirt2.png";
import Shirt3 from "../assets/shirt3.png";
import Shirt4 from "../assets/shirt4.png";
import Shirt5 from "../assets/shirt5.png";
import Shirt6 from "../assets/shirt6.png";
import Shirt7 from "../assets/shirt7.png";
import Shirt8 from "../assets/shirt8.png";
import Shirt9 from "../assets/shirt9.png";
import Shirt10 from "../assets/shirt10.png";
import Shirt11 from "../assets/shirt11.png";
import Shirt12 from "../assets/shirt12.png";

export const colorOptions = [
    { name: "Black", count: 6 },
    { name: "Blue", count: 20 },
    { name: "Brown", count: 10 },
    { name: "Neutral", count: 23 },
    { name: "Gray", count: 16 },
    { name: "Green", count: 12 },
    { name: "Pink", count: 10 },
    { name: "Red", count: 7 },
    { name: "White", count: 24 },
    { name: "Yellow", count: 29 },
  ];

  export const categoryOptions = [
    { name: "Top", count: 6 },
    { name: "Sweaters", count: 20 },
    { name: "Pants", count: 10 },
    { name: "Dresses", count: 23 },
    { name: "Bottoms", count: 6 },
    { name: "Bodysuits & Jumpsuits", count: 6 },
  ];

  export const fabricsOptions = [
    { name: "Cotton", count: 6 },
    { name: "Silk", count: 23 },
    { name: "Nylon", count: 10 },
    { name: "Rayon", count: 12 },
    { name: "Wood-Silk", count: 20 },
    { name: "Viscose Jersey", count: 17 },
    { name: "Hemp", count: 8 },
  ];

  export const sortOptions = [
    { name: "Best Selling" },
    { name: "Alphabetically, A-Z" },
    { name: "Alphabetically, Z-A" },
    { name: "Price, Low to High" },
    { name: "Price, High to Low" },
    { name: "Date, Old to New" },
    { name: "Date, New to Old" },

  ];

  export const products = [
    { 
        id: 1, 
        name: "Basic Bae Full Size Ribbed Round Neck Long T-Shirt", 
        price: 1500, 
        image: Shirt1, 
        color: "Black", 
        category: "Top", 
        fabric: "Cotton",
        bestselling: true,
        isNewArrival: true
    },
    { 
        id: 2, 
        name: "Round Neck Tiered Tank Top", 
        price: 3000, 
        image: Shirt2, 
        color: "Blue", 
        category: "Dresses", 
        fabric: "Silk",
        bestselling: true ,
        isNewArrival: true
    },
    { 
        id: 3, 
        name: "Lantern Sleeve O-neck Casual Party Tunic Blouse", 
        price: 3000, 
        image: Shirt3, 
        color: "Brown", 
        category: "Top",
        fabric: "Nylon",
        bestselling: false,
        isNewArrival: true
    },
    { 
        id: 4, 
        name: "Full Size Ribbed Round Neck Short Sleeve T-Shirt", 
        price: 1500, 
        image: Shirt4, 
        color: "White", 
        category: "Top", 
        fabric: "Cotton",
        bestselling: true,
        isNewArrival: true
    },
    { 
        id: 5, 
        name: "Simon Longsleeve Top", 
        price: 2500, 
        image: Shirt5, 
        color: "Gray", 
        category: "Sweaters", 
        fabric: "Rayon",
        bestselling: false,
        isNewArrival: true
    },
    { 
        id: 6, 
        name: "Blouse with Notched Neck", 
        price: 3000, 
        image: Shirt6, 
        color: "Pink", 
        category: "Top", 
        fabric: "Silk", 
        tag: "Save 20%",
        bestselling: true,
        isNewArrival: true
    },
    { 
      id: 7, 
      name: "Halter Neck Blouse With Keyhole Back", 
      price: 2500, 
      image: Shirt7, 
      color: "Red", 
      category: "Dresses", 
      fabric: "Viscose Jersey",
      bestselling: false,
      isNewArrival: true
    },
    { 
      id: 8, 
      name: "Urban Solid Color Lapel Long Sleeves Blouse",
      price: 2700, 
      image: Shirt8, 
      color: "Green", 
      category: "Sweaters", 
      fabric: "Hemp", 
      tag: "Save 20%",
      bestselling: true,
      isNewArrival: true
    },
    { 
      id: 9, 
      name: "Full Size Round Neck Tank Top", 
      price: 3000, 
      image: Shirt9,
      color: "Neutral", 
      category: "Bodysuits & Jumpsuits", 
      fabric: "Silk",
      bestselling: false,
      isNewArrival: true
    },
    { 
      id: 10, 
      name: "Mads Turtleneck Top", 
      price: 3000, 
      image: Shirt10, 
      color: "Yellow", 
      category: "Sweaters", 
      fabric: "Wood-Silk", 
      tag: "Save 20%",
      bestselling: true,
      isNewArrival: true
    },
    { 
      id: 11, 
      name: "Lace Top with High Neck",
      price: 2200, 
      image: Shirt11, 
      color: "Blue", 
      category: "Top", 
      fabric: "Cotton",
      bestselling: false,
      isNewArrival: true
    },
    { 
      id: 12, 
      name: "Swiss Dot Blouse with Shirred Flounce Sleeve", 
      price: 3000, 
      image: Shirt12, 
      color: "Brown", 
      category: "Pants", 
      fabric: "Nylon" ,
      bestselling: true,
      isNewArrival: true
    },
  ];