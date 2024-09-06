import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { StatusCodes } from 'http-status-codes'
dotenv.config()

const generalAccessToken = async (payload) => {

    const access_Token = jwt.sign({
        payload
    }, process.env.ACCESS_TOKEN, { expiresIn: '30s' })
    return access_Token
}
const generalRefreshToken = async (payload) => {

    const refresh_Token = jwt.sign({
        payload
    }, process.env.REFRESH_TOKEN, { expiresIn: '365d' })
    return refresh_Token
}
const refreshToken = async (token) => {
    try {
        jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
            if (err) {
                return {
                    status: 'ERROR',
                    message: 'The authemtication',
                }
            }
            const { payload } = user
            const access_token = await JwtService.generalAccessToken({
                id: payload?.id,
                isAdmin: payload?.isAdmin
            })
            console.log('ads', access_token);

            return ({
                status: StatusCodes.OK,
                message: 'Success',
                access_token: access_token
            })
        })

    } catch (error) {
        console.error('Error during update:', error);  // Log lỗi nếu có
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        };
    }
}

export const JwtService = {
    generalAccessToken,
    generalRefreshToken,
    refreshToken
}