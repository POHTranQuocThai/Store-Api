import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { UserController } from '../../controllers/UserController.js'

const Router = express.Router()
Router.route('/')
    .post(UserController.createNew)
Router.route('/sign-in')
    .post(UserController.loginUser)
export const UserRouter = Router