import jwt from 'jsonwebtoken'
const genneralAccessToken = async (payload) => {
    console.log(payload);

    const access_Token = jwt.sign({
        payload
    }, 'access_Token', { expiresIn: '1h' })
    return access_Token
}
const genneralRefreshToken = async (payload) => {
    console.log(payload);

    const access_Token = jwt.sign({
        payload
    }, 'refresh_Token', { expiresIn: '365d' })
    return access_Token
}

export const JwtService = {
    genneralAccessToken,
    genneralRefreshToken
}