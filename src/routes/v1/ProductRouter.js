import express from 'express'
import { ProductController } from '../../controllers/ProductController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
const Router = express.Router()

Router.route('/create')
    .post(ProductController.createProduct)
Router.route('/update/:id')
    .put(authMiddleware.auth, ProductController.updateProduct)
Router.route('/delete/:id')
    .delete(authMiddleware.auth, ProductController.deleteProduct)
Router.route('/get-detail/:id')
    .get(ProductController.getDetailsProduct)
Router.route('/getAll')
    .get(ProductController.getAllProduct)
Router.route('/delete-many')
    .post(authMiddleware.auth, ProductController.deleteMany)
Router.route('/get-all-type')
    .get(ProductController.getAllType)
export const ProductRouter = Router