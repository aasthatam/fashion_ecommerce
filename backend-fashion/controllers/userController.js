import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
         const token = createToken({ id: user._id, role: user.role });
         res.json({success: true, token})
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
      const token = createToken({ id: user._id, role: user.role });
 
       // Send response with token
       res.json({ success: true, token });
 
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
 
export { loginUser, registerUser, adminLogin }