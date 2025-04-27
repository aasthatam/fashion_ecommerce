import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// function for add product
const addProduct = async (req,res) => {
   try {
    const { name, details, price, category, sizes, bestselling, fabric, tags, isNewArrival, availability, colors, suitableBodyType} = req.body
    const image1 = req.files.image1 && req.files.image1[0]
    const image2 = req.files.image2 && req.files.image2[0]
    const image3 = req.files.image3 && req.files.image3[0]
    const image4 = req.files.image4 && req.files.image4[0]

    const images =[ image1, image2, image3, image4 ].filter((item) => item !== undefined)

    let imagesUrl = await Promise.all(
        images.map(async (item) => {
            let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'});
            return result.secure_url
        })
    )

    const productData = {
        name,
        details,
        price: Number(price),
        category,
        sizes: JSON.parse(sizes),
        bestselling: bestselling === "true" ? true : false,
        images: imagesUrl,
        createdAt: Date.now(),
        fabric: fabric || "",
        tags: tags ? JSON.parse(tags) : [],
        isNewArrival: isNewArrival === "true",
        availability: availability || "In Stock",
        colors: colors || "",
        suitableBodyType: suitableBodyType ? JSON.parse(suitableBodyType) : []
    }
    console.log(productData);

    const product = new productModel(productData);
    await product.save()

    res.json({ success: true, message: "Product Added"})
   } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message})
    
   }
}

// function for list product
const listProduct = async (req,res) => {
    try {
        const products = await productModel.find({});
        res.json({success: true, products})
        
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// function for remove product
const removeProduct = async (req,res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success: true, message: "Product Removed"})
        
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
        
    }

}

// function for single product info
const singleProduct = async (req,res) => {
    try {
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({success: true, product})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

const updateProduct = async (req, res) => {
    try {
      const {
        id,
        name,
        details,
        price,
        category,
        fabric,
        sizes,
        tags,
        isNewArrival,
        availability,
        colors,
        bestselling,
        suitableBodyType
      } = req.body;
  
      const updatedProduct = await productModel.findByIdAndUpdate(
        id,
        {
          name,
          details,
          price: Number(price),
          category,
          fabric,
          sizes: JSON.parse(sizes),
          tags: JSON.parse(tags),
          availability,
          colors,
          isNewArrival: isNewArrival === true || isNewArrival === "true",
          bestselling: bestselling === true || bestselling === "true",
          suitableBodyType: suitableBodyType ? JSON.parse(suitableBodyType) : []
        },
        { new: true }
      );
  
      if (!updatedProduct) {
        return res.json({ success: false, message: "Product not found" });
      }
  
      res.json({ success: true, message: "Product updated", product: updatedProduct });
    } catch (error) {
      console.log("Update Error:", error);
      res.json({ success: false, message: error.message });
    }
  };

  const recommendProduct = async (req, res) => {
    try {
        const { shape } = req.query; // for example: "hourglass"
        if (!shape) {
            return res.json({ success: false, message: "Shape parameter missing" });
        }

        const products = await productModel.find({
            suitableBodyType: { $in: [shape.toLowerCase()] }
        });

        res.json({ success: true, products });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export { addProduct, listProduct, removeProduct, singleProduct, updateProduct, recommendProduct};
