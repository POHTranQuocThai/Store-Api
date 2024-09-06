import { StatusCodes } from "http-status-codes"
import { UserService } from "../services/UserService.js"
import { JwtService } from "../services/jwtService.js"


const createNew = async (req, res) => {
    try {
        console.log(req.body)
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
        return res.status(StatusCodes.CREATED).json(createUser)
    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: error })
    }
}
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body

        if (!userId) {
            return res.status(StatusCodes.OK).json({ message: 'The user is required' })
        }
        const response = await UserService.updateUser(userId, data)
        return res.status(StatusCodes.OK).json(response)
    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: error })
    }
}
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        console.log(userId);

        if (!userId) {
            return res.status(StatusCodes.OK).json({ message: 'The user is required' })
        }
        const response = await UserService.deleteUser(userId)
        return res.status(StatusCodes.OK).json(response)
    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: error })
    }
}
const getAllUser = async (req, res) => {
    try {

        const response = await UserService.getAllUser()
        return res.status(StatusCodes.OK).json(response)
    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: error })
    }
}
const getDetailsUser = async (req, res) => {
    try {
        const detailUserId = req.params.id
        const response = await UserService.getDetailsUser(detailUserId)
        return res.status(StatusCodes.OK).json(response)
    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: error })
    }
}
const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.headers.token.split(' ')[1]
        const response = await JwtService.refreshToken(refreshToken)
        return res.status(StatusCodes.OK).json(response)
    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: error })
    }
}
const loginUser = async (req, res) => {
    try {
        console.log(req.body)
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
        const loginUser = await UserService.loginUser(req.body)
        return res.status(StatusCodes.OK).json(loginUser)
    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: error })
    }
}

export const UserController = {
    createNew,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken
}