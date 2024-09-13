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
const refreshToken = async (token) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if (err) {
                    return reject({
                        status: 'ERR',
                        message: err.message || 'Invalid token',
                    });
                }

                console.log('user', user);

                try {
                    // Tạo access token mới
                    const access_token = await JwtService.generalAccessToken({
                        id: user?.id,
                        isAdmin: user?.isAdmin
                    });

                    console.log('access', access_token);

                    return resolve({
                        status: StatusCodes.OK,
                        message: 'Success',
                        access_token
                    });
                } catch (generateError) {
                    return reject({
                        status: 'ERR',
                        message: generateError.message || 'Failed to generate access token',
                    });
                }
            });
        } catch (error) {
            console.error('Error during token verification:', error);
            return reject({
                status: 'ERR',
                message: error.message || 'Internal server error',
            });
        }
    });
};


export const JwtService = {
    generalAccessToken,
    generalRefreshToken,
    refreshToken
}