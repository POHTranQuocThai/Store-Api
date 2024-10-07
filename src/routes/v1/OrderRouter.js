import express from 'express'
import { OrderController } from '../../controllers/OrderController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
const Router = express.Router()

Router.route('/create')
    .post(authMiddleware.authUser, OrderController.createOrder)
export const OrderRouter = Router