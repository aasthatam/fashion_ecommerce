import express from 'express';
import { listProduct, addProduct, removeProduct, singleProduct, updateProduct, recommendProduct, findSimilarProducts } from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

productRouter.get('/list', listProduct);
productRouter.get('/recommendations', recommendProduct);
productRouter.post('/add', adminAuth, upload.fields([{name: 'image1', maxCount: 1}, {name: 'image2', maxCount: 1}, {name: 'image3', maxCount: 1}, {name: 'image4', maxCount: 1}]),  addProduct);
productRouter.post('/remove', adminAuth, removeProduct);
productRouter.post('/single', singleProduct);
productRouter.post('/update', updateProduct);
productRouter.post('/similar', findSimilarProducts);

export default productRouter;

