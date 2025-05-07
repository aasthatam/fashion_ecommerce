import express from 'express';
import { loginUser, registerUser, adminLogin, resetPassword, updateBodyShape, getProfile, getAllCustomers, saveSearchKeyword, recommendFromSearch, getNotifications} from '../controllers/userController.js';
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.post('/reset-password', resetPassword);
userRouter.put("/body-shape", authUser, updateBodyShape);
userRouter.get("/profile", authUser, getProfile);
userRouter.get("/all", getAllCustomers);
userRouter.post("/search", saveSearchKeyword);
userRouter.post("/recent-search-recommendations", recommendFromSearch);
userRouter.post("/notifications", authUser, getNotifications)

export default userRouter;
