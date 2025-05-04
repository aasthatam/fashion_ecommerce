import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import axios from "axios";
import crypto from "crypto";


// FastAPI service URL
const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";

// Generate UUID from string for Qdrant compatibility
function generateUUID(str) {
    // Create MD5 hash from the string
    const md5Hash = crypto.createHash('md5').update(str).digest('hex');
    // Format it as a UUID
    return `${md5Hash.substring(0, 8)}-${md5Hash.substring(8, 12)}-${md5Hash.substring(12, 16)}-${md5Hash.substring(16, 20)}-${md5Hash.substring(20, 32)}`;
}

// function for add product
const addProduct = async (req,res) => {
   try {
    const { name, details, price, category, sizes, bestselling, fabric, tags, isNewArrival, availability, colors, suitableBodyType } = req.body
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

    // Send images to FastAPI for embedding storage after product is saved
    try {
        // Get the product ID
        const productId = product._id.toString();
        
        // Send each image to FastAPI service for embedding generation and storage
        const embedPromises = imagesUrl.map(async (imageUrl, index) => {
            try {
                const originalId = `${productId}_${index}`;
                const uuid = generateUUID(originalId);
                
                const response = await axios.post(`${FASTAPI_URL}/store_embedding`, {
                    product_id: uuid,
                    original_id: originalId,
                    image_url: imageUrl
                });
                
                return response.data;
            } catch (error) {
                console.error(`Error sending image ${index + 1} to embedding service:`, error.message);
                return null;
            }
        });
        
        // Wait for all embedding requests to complete
        await Promise.all(embedPromises);
        console.log(`Embeddings created for product ${productId}`);
    } catch (embedError) {
        // Don't fail the product creation if embedding fails
        console.error("Error generating embeddings:", embedError.message);
    }

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
// function to find similar products
const findSimilarProducts = async (req, res) => {
    try {
        const { productId, imageUrl, limit = 5 } = req.body;
        
        if (!productId && !imageUrl) {
            return res.json({ 
                success: false, 
                message: "Either productId or imageUrl must be provided" 
            });
        }
        
        // Call FastAPI service to find similar products
        const requestData = {
            image_url: imageUrl,
            top_k: limit
        };
        
        // If productId is provided, convert it to UUID for Qdrant
        if (productId) {
            // Handle the case where we need to check which image index to use
            // If only searching by product ID, use the first image (index 0)
            const originalId = `${productId}_0`;
            requestData.product_id = generateUUID(originalId);
        }
        
        const response = await axios.post(`${FASTAPI_URL}/find_similar`, requestData);
        
        if (response.data && response.data.success) {
            // Get product details for the similar products
            const similarProductIds = response.data.similar_products
                .map(item => {
                    // Extract the base product ID (remove the _index suffix)
                    const parts = item.product_id.split('_');
                    return parts[0]; // Return just the MongoDB ID part
                })
                .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
            
            // Fetch full product details from MongoDB
            const similarProducts = await productModel.find({
                _id: { $in: similarProductIds }
            });
            
            return res.json({
                success: true,
                similar_products: similarProducts,
                similarity_info: response.data.similar_products
            });
        } else {
            return res.json({
                success: false,
                message: "Failed to find similar products"
            });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addProduct, listProduct, removeProduct, singleProduct, updateProduct, recommendProduct, findSimilarProducts };
