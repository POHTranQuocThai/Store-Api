import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const generalAccessToken = async (payload) => {
    console.log(payload);

    const access_Token = jwt.sign({
        payload
    }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
    return access_Token
}
const generalRefreshToken = async (payload) => {
    console.log(payload);

    const refresh_Token = jwt.sign({
        payload
    }, process.env.REFRESH_TOKEN, { expiresIn: '365d' })
    return refresh_Token
}

export const JwtService = {
    generalAccessToken,
    generalRefreshToken
}