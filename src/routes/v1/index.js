
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { UserRouter } from './UserRouter.js'
import { ProductRouter } from './ProductRouter.js'
import { OrderRouter } from './OrderRouter.js'

const Router = express.Router()
Router.get('/status', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Api_V1' })
})
Router.use('/users', UserRouter)
Router.use('/products', ProductRouter)
Router.use('/orders', OrderRouter)
export const APIs_V1 = Router