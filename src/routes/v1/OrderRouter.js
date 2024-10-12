import express from 'express'
import { OrderController } from '../../controllers/OrderController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
const Router = express.Router()

Router.route('/create')
    .post(authMiddleware.authUser, OrderController.createOrder)
Router.route('/get-detail-order/:id')
    .get(authMiddleware.authUser, OrderController.getDetailsOrder)
export const OrderRouter = Router