import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { StatusCodes } from 'http-status-codes'
dotenv.config()

const generalAccessToken = async (payload) => {

    const access_token = jwt.sign({
        ...payload
    }, process.env.ACCESS_TOKEN, { expiresIn: '30s' })
    return access_token

}
const generalRefreshToken = async (payload) => {

    const refresh_token = jwt.sign({
        ...payload
    }, process.env.REFRESH_TOKEN, { expiresIn: '365d' })
    return refresh_token
}
const refreshToken = (token) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if (err) {
                    return reject({
                        status: 'ERR',
                        message: 'The authentication failed',
                    });
                }

                console.log('user', user);

                const { payload } = user;
                const access_token = await JwtService.generalAccessToken({
                    id: payload?.id,
                    isAdmin: payload?.isAdmin,
                });
                console.log('access', access_token);

                resolve({
                    status: StatusCodes.OK,
                    message: 'Success',
                    access_token,
                })
            })

        } catch (error) {
            console.error('Error during update:', error);
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                message: error.message,
            };
        }
    });


};

export const JwtService = {
    generalAccessToken,
    generalRefreshToken,
    refreshToken
}