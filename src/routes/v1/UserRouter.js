import express from 'express'
import { UserController } from '../../controllers/UserController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'

const Router = express.Router()
Router.route('/sign-up')
    .post(UserController.createNew)
Router.route('/sign-in')
    .post(UserController.loginUser)
Router.route('/log-out')
    .post(UserController.logOutUser)
Router.route('/update-user/:id')
    .put(authMiddleware.authUser, UserController.updateUser)
Router.route('/delete-user/:id')
    .delete(authMiddleware.auth, UserController.deleteUser)
Router.route('/getAll')
    .get(authMiddleware.auth, UserController.getAllUser)
Router.route('/get-details/:id')
    .get(authMiddleware.authUser, UserController.getDetailsUser)
Router.route('/refresh-token')
    .post(UserController.refreshToken)
    Router.route('/delete-many')
    .delete(authMiddleware.auth, UserController.deleteMany)
export const UserRouter = Router 