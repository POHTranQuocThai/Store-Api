import { StatusCodes } from "http-status-codes"
import { UserService } from "../services/UserService.js"
import { JwtService } from "../services/jwtService.js"


const createNew = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isCheckEmail = regex.test(email)
        //const existEmail = await GET_DB().collection('users').findOne({ email: email })
        if (!email || !password || !confirmPassword) {
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
const deleteMany = async (req, res) => {
    try {
        const ids = req.body.ids

        if (!ids) {
            return res.status(StatusCodes.OK).json({ message: 'The ids is required' })
        }
        const response = await UserController.deleteMany(ids)
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

        console.log('req.cookies', req.cookies.refresh_token);
        const refreshToken = req.cookies.refresh_token
        if (!refreshToken) {
            return res.status(StatusCodes.OK).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        const response = await JwtService.refreshToken(refreshToken)
        console.log('response', response);

        return res.status(StatusCodes.OK).json(response)
    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: error })
    }
}
const loginUser = async (req, res) => {
    try {

        console.log(req.body)
        const { email, password } = req.body
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isCheckEmail = regex.test(email)
        if (!email || !password) {
            return res.status(StatusCodes.OK).json({ status: 'ERR', message: 'The input is required' })
        } else if (!isCheckEmail) {
            return res.status(StatusCodes.OK).json({ status: 'ERR', message: 'The Email is invalid' })
        }
        const loginUser = await UserService.loginUser(req.body)
        console.log('login', loginUser);

        const { refresh_token, ...newloginUser } = loginUser
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        })

        return res.status(StatusCodes.OK).json(newloginUser)
    } catch (error) {
        throw error
    }
}
const logOutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token', {
            path: '/' // Đảm bảo rằng cookie được xóa trên toàn bộ trang web
        });
        return res.status(StatusCodes.OK).json({
            massage: 'Logout successfully'
        })
    } catch (error) {
        throw error
    }
}

export const UserController = {
    createNew,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken, logOutUser,
    deleteMany
}