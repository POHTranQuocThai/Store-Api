import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';
import { GET_DB } from '../config/mongodb.js';  // Đảm bảo rằng GET_DB được import chính xác


const createNew = async (data) => {
    try {
        const newUser = await UserModel.createNew(data);
        return newUser;
    } catch (error) {
        throw error;
    }
};

const loginUser = async (data, res) => {
    try {
        const { email, password } = data;  // Lấy email và password từ data

        // Tìm người dùng bằng email
        const checkUser = await GET_DB().collection('users').findOne({ email: email });
        if (!checkUser) {  // Kiểm tra nếu người dùng không tồn tại
            return {
                status: StatusCodes.NOT_FOUND,
                message: 'The user is not defined'
            };
        }

        // So sánh mật khẩu đã hash
        const comparePassword = bcrypt.compareSync(password, checkUser.password);
        console.log('Password match result:', comparePassword);  // Đảm bảo `comparePassword` được log ra
        if (!comparePassword) {  // Nếu mật khẩu không khớp
            return {
                status: StatusCodes.UNAUTHORIZED,
                message: 'The password is incorrect'
            };
        }
        const access_Token = await genneralAccessToken({
            id: checkUser._id,
            isAdmin: checkUser.isAdmin
        })
        const refresh_Token = await genneralRefreshToken({
            id: checkUser._id,
            isAdmin: checkUser.isAdmin
        })
        console.log('access-token', access_Token);
        // Nếu mật khẩu khớp, trả về thông tin người dùng
        return {
            status: StatusCodes.OK,
            message: 'Success',
            access_Token,
            refresh_Token
        };

    } catch (error) {
        console.error('Error during login:', error);  // Log lỗi nếu có
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        };
    }
};

export const UserService = {
    createNew,
    loginUser
};
