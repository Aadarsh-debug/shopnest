import express from "express"
import { protect } from "../middlewares/authmiddleware.js"
import { admin } from "../middlewares/adminmiddleware.js"
import {getAllProducts,createProduct,getProductById,updateProduct,deleteProduct} from "../controllers/productcontroller.js"
import multer from "multer"
const upload =multer({ dest:"uploads/"})

const router=express.Router()
router.route('/').get(getAllProducts).post(protect,admin,upload.single('image'),createProduct);
router.route('/:id').get(getProductById).put(protect,admin,updateProduct).delete(protect,admin,deleteProduct);
export default router