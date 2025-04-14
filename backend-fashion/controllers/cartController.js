import userModel from "../models/userModel.js";
import mongoose from "mongoose";
//add products to user
const addToCart = async (req,res) => {
    try {
        const { userId, itemId, size } = req.body
        
        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        if (cartData[itemId]) {
            if(cartData[itemId][size]) {
                cartData[itemId][size] += 1
            }
            else {
                cartData[itemId][size] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }
        await userModel.findByIdAndUpdate(userId, {cartData})

        res.json({ success: true, message: "Added To Cart" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }

}

//update products to user
const updateCart = async (req,res) => {
    try {
        const { userId, itemId, size, quantity } = req.body 

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        cartData[itemId][size] = quantity

        await userModel.findByIdAndUpdate(userId, {cartData})

        res.json({ success: true, message: "Cart Updated" })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message})

    }
    
}

//get user cart data
const getUserCart = async (req,res) => {
    try {
        const { userId } = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        res.json({ success: true, cartData })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message})

    }
}

const removeFromCart = async (req, res) => {
    try {
      const { userId, itemId, size } = req.body;
  
      const userData = await userModel.findById(userId);
      let cartData = userData.cartData;
  
      if (cartData[itemId]) {
        delete cartData[itemId][size];
  
        // If no sizes left, delete the itemId key itself
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
  
        await userModel.findByIdAndUpdate(userId, { cartData });
      }
  
      res.json({ success: true, message: "Item removed from cart" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  
  export { addToCart, updateCart, getUserCart, removeFromCart };
  