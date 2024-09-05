import { StatusCodes } from "http-status-codes"
import { UserService } from "../services/UserService.js"
import { GET_DB } from "../config/mongodb.js"

const createNew = async (req, res) => {
    try {
        console.log(req.body)
        // const res = await UserService.createNew(req.body)
        const { name, email, password, confirmPassword, phone } = req.body
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isCheckEmail = regex.test(email)
        //const existEmail = await GET_DB().collection('users').findOne({ email: email })
        if (!name || !email || !password || !confirmPassword || !phone) {
            return res.status(StatusCodes.OK).json({ status: 'ERR', message: 'The input is required' })
        } else if (!isCheckEmail) {
            return res.status(StatusCodes.OK).json({ status: 'ERR', message: 'The Email is invalid' })
        } else if (password !== confirmPassword) {
            return res.status(StatusCodes.OK).json({ status: 'ERR', message: 'The password is equal confirm password' })
        }
        // else if (existEmail) {
        //     return res.status(StatusCodes.OK).json({ status: 'ERR', message: 'The email is already' })
        // }
        const createUser = await UserService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createUser)
        return createUser
    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: error })
    }
}
const loginUser = async (req, res) => {
    try {
        console.log(req.body)
        // const res = await UserService.createNew(req.body)
        const { name, email, password, confirmPassword, phone } = req.body
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isCheckEmail = regex.test(email)
        //const existEmail = await GET_DB().collection('users').findOne({ email: email })
        if (!name || !email || !password || !confirmPassword || !phone) {
            return res.status(StatusCodes.OK).json({ status: 'ERR', message: 'The input is required' })
        } else if (!isCheckEmail) {
            return res.status(StatusCodes.OK).json({ status: 'ERR', message: 'The Email is invalid' })
        } else if (password !== confirmPassword) {
            return res.status(StatusCodes.OK).json({ status: 'ERR', message: 'The password is equal confirm password' })
        }
        // else if (existEmail) {
        //     return res.status(StatusCodes.OK).json({ status: 'ERR', message: 'The email is already' })
        // }

        return await UserService.loginUser(req.body)
    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: error })
    }
}

export const UserController = {
    createNew,
    loginUser
}