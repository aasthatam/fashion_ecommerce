import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import productModel from "../models/productModel.js"; 


// const createToken = (id) => {
//     return jwt.sign({id}, process.env.JWT_SECRET)
// }
const createToken = (payload) => {
   return jwt.sign(payload, process.env.JWT_SECRET);
}

// Route for user login
const loginUser = async (req, res) => {
   try {
      const { email, password } = req.body;
      const user = await userModel.findOne({email});
      if (!user) {
         return res.json({ success: false, message: "User doesn't exists" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
         // const token = createToken(user._id)
         const token = createToken({ id: user._id, role: user.role, name: user.name });
         res.json({success: true, token,
            user: {
               _id: user._id,
               name: user.name,
               email: user.email,
               role: user.role
             }
         })
      }
      else{
         res.json({success: false, message: "Invalid credentials"})
      }
   } catch (error) {
      console.log(error);
       res.json({ success: false, message: error.message });
   }
}

// Route for user registration
const registerUser = async (req, res) => {
    try {
       const { name, email, password } = req.body;
       // Check if user already exists
       const exists = await userModel.findOne({ email });
       if (exists) {
          return res.json({ success: false, message: "User already exists" });
       }
 
       // Validate email format
       if (!validator.isEmail(email)) {
          return res.json({ success: false, message: "Please enter a valid email" });
       }
 
       // Validate password length
       if (password.length < 8) {
          return res.json({ success: false, message: "Password must be at least 8 characters long" });
       }

       const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
         if (!passwordRegex.test(password)) {
            return res.json({ success: false, message: "Password must be stronger: 8 characters, uppercase, lowercase, number, special character." });
         }
 
       // Hash user password
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password, salt);
 
       // Create new user
       const newUser = new userModel({
          name,
          email,
          password: hashedPassword
       });
 
       // Save user to database
       const user = await newUser.save();
 
       // Create JWT token
      //  const token = createToken(user._id);
      const token = createToken({ id: user._id, role: user.role, name: user.name });
 
       // Send response with token
       res.json({ success: true, token,
         user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
 
    } catch (error) {
       console.log(error);
       res.json({ success: false, message: error.message });
    }
 }

// Route for admin login
const adminLogin = async (req, res) => {
   try {
     const { email, password } = req.body;
 
     if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
       // Check if admin already exists in DB
       let admin = await userModel.findOne({ email });
 
       if (!admin) {
         // Save admin to DB with hashed password
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password, salt);
 
         admin = new userModel({
           name: "Admin",
           email,
           password: hashedPassword,
           role: "admin"  
         });
 
         await admin.save();
       }
 
       // Create token
      //  const token = createToken(admin._id);
      const token = createToken({ id: admin._id, role: "admin" });
       res.json({ success: true, token });
     } else {
       res.json({ success: false, message: "Invalid credentials" });
     }
 
   } catch (error) {
     console.log(error);
     res.json({ success: false, message: error.message });
   }

   // try{
   //    const {email, password} = req.body
   //    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
   //       const json = jwt.sign(email+password, process.env.JWT_SECRET);
   //       res.json({success: true, token})
   //    } else {
   //       res.json({success: false, message: 'Invalid credentials'})
   //    }
   // } catch(error){
   //    console.log(error);
   //    res.json({ success: false, message: error.message });

   // }
 };

 // Add this function in userController.js

const resetPassword = async (req, res) => {
   try {
       const { email, newPassword } = req.body;

       const user = await userModel.findOne({ email });

       if (!user) {
           return res.status(400).json({ success: false, message: "User not found" });
       }

       // Hash the new password before saving (very important)
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(newPassword, salt);

       user.password = hashedPassword;
       await user.save();

       res.status(200).json({ success: true, message: "Password updated successfully" });
   } catch (error) {
       console.error(error);
       res.status(500).json({ success: false, message: "Server error" });
   }
};

const updateBodyShape = async (req, res) => {
   try {
     const { userId } = req.body; // from JWT
     const { bodyShape } = req.body;
 
     if (!bodyShape) {
       return res.status(400).json({ success: false, message: "Body shape is required" });
     }
 
     const user = await userModel.findByIdAndUpdate(
       userId,
       { bodyShape },
       { new: true }
     ).select("-password");
 
     if (!user) {
       return res.status(404).json({ success: false, message: "User not found" });
     }
 
     res.json({ success: true, user });
   } catch (err) {
     console.error(err);
     res.status(500).json({ success: false, message: "Server error" });
   }
 };

 const getProfile = async (req, res) => {
   try {
     const { userId } = req.body; // set by authUser middleware
 
     const user = await userModel.findById(userId).select("name email role bodyShape");
 
     if (!user) {
       return res.status(404).json({ success: false, message: "User not found" });
     }
 
     res.json({ success: true, user });
   } catch (err) {
     console.error(err);
     res.status(500).json({ success: false, message: "Server error" });
   }
 };

 const getAllCustomers = async (req, res) => {
  try {
    const users = await userModel.find({ role: "customer" }).select("_id name email");
    res.json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const saveSearchKeyword = async (req, res) => {
  try {
    const { userId, keyword } = req.body;

    if (!userId || !keyword) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const updatedSearches = [keyword, ...user.recentSearches.filter(k => k !== keyword)].slice(0, 5);
    user.recentSearches = updatedSearches;
    await user.save();

    res.json({ success: true, message: "Search saved", recentSearches: updatedSearches });
  } catch (err) {
    console.error("Search log error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const recommendFromSearch = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);

    if (!user || !user.recentSearches.length) {
      return res.json({ success: true, products: [] });
    }

    const searchRegex = user.recentSearches.flatMap(keyword => [
      { name: { $regex: keyword, $options: "i" } },
      { category: { $regex: keyword, $options: "i" } },
      { tags: { $elemMatch: { $regex: keyword, $options: "i" } } }
    ]);

    const matchedProducts = await productModel.find({ $or: searchRegex }).limit(12);

    res.json({ success: true, products: matchedProducts });
  } catch (err) {
    console.error("Recommend error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getNotifications = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId).select("notifications");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, notifications: user.notifications });
  } catch (error) {
    console.error("Fetch notification error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


 

 
export { loginUser, registerUser, adminLogin, resetPassword, updateBodyShape, getProfile, getAllCustomers, saveSearchKeyword, recommendFromSearch, getNotifications }