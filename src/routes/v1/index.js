
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { UserRouter } from './UserRouter.js'
import { ProductRouter } from './ProductRouter.js'

const Router = express.Router()
Router.get('/status', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Api_V1' })
})
Router.use('/users', UserRouter)
Router.use('/products', ProductRouter)
export const APIs_V1 = Router