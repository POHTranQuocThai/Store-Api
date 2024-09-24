import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';
import { GET_DB } from '../config/mongodb.js';  // Đảm bảo rằng GET_DB được import chính xác
import { JwtService } from './jwtService.js';
import { ObjectId } from 'mongodb';
import { UserModel } from '../models/UserModel.js';

const createNew = async (data) => {
    try {
        const newUser = await UserModel.createNew(data);
        return newUser;
    } catch (error) {
        throw error;
    }
};

const updateUser = async (id, data) => {
    try {
        // Tìm người dùng bằng ID
        const checkUser = await GET_DB().collection('users').findOne({ _id: new ObjectId(id) });

        if (!checkUser) {  // Kiểm tra nếu người dùng không tồn tại
            return {
                status: StatusCodes.NOT_FOUND,
                message: 'The user is not defined'
            };
        }
        // Cập nhật người dùng
        const updatedUser = await GET_DB().collection('users').findOneAndUpdate(
            { _id: new ObjectId(id) }, // Query to find the user by id
            { $set: data },            // Update the user data
            { returnDocument: 'after' } // Option to return the updated document
        );

        // Kiểm tra nếu cập nhật không thành công
        return {
            status: StatusCodes.OK,
            message: 'Update user success',
            data: updatedUser // Trả về `value` chứa dữ liệu cập nhật
        };

    } catch (error) {
        console.error('Error during update:', error);  // Log lỗi nếu có
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        };
    }
};
const deleteUser = async (id) => {
    try {
        // Tìm người dùng bằng ID
        const checkUser = await GET_DB().collection('users').findOne({ _id: new ObjectId(id) });

        if (!checkUser) {  // Kiểm tra nếu người dùng không tồn tại
            return {
                status: StatusCodes.NOT_FOUND,
                message: 'The user is not defined'
            };
        }
        const deletedUser = await GET_DB().collection('users').findOneAndDelete(
            { _id: new ObjectId(id) }, // Query to find the user by id
        );
        // Kiểm tra nếu cập nhật không thành công
        return {
            status: StatusCodes.OK,
            message: 'Delete user success',
            //data: deletedUser // Trả về `value` chứa dữ liệu cập nhật
        };

    } catch (error) {
        console.error('Error during update:', error);  // Log lỗi nếu có
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        };
    }
};
const deleteMany = async (ids) => {
    try {
        const objectIds = ids.map(id => new ObjectId(id)); // Chuyển đổi các ID thành ObjectId
        const deletedUser = await GET_DB().collection('users').deleteMany(
            { _id: { $in: objectIds } }// Query to find the user by id          
        )
        // Kiểm tra nếu cập nhật không thành công
        return {
            status: StatusCodes.OK,
            message: 'Delete prooduct success',
            data: deletedUser // Trả về `value` chứa dữ liệu cập nhật
        };

    } catch (error) {
        console.error('Error during update:', error);  // Log lỗi nếu có
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        };
    }
};
const getAllUser = async () => {
    try {

        const allUser = await GET_DB().collection('users').find().toArray()
        if (!allUser) {  // Kiểm tra nếu người dùng không tồn tại
            return {
                status: StatusCodes.NOT_FOUND,
                message: 'The user is not defined'
            };
        }
        return {
            status: StatusCodes.OK,
            message: 'Get user success',
            data: allUser // Trả về `value` chứa dữ liệu cập nhật
        };


    } catch (error) {
        console.error('Error during update:', error);  // Log lỗi nếu có
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        };
    }
};
const getDetailsUser = async (id) => {
    try {

        const detailUser = await GET_DB().collection('users').findOne({ _id: new ObjectId(id) })
        if (!detailUser) {  // Kiểm tra nếu người dùng không tồn tại
            return {
                status: StatusCodes.NOT_FOUND,
                message: 'The user is not defined'
            };
        }
        return {
            status: StatusCodes.OK,
            message: 'Get detail user success',
            data: detailUser // Trả về `value` chứa dữ liệu cập nhật
        };

    } catch (error) {
        console.error('Error during update:', error);  // Log lỗi nếu có
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        };
    }
};

const loginUser = async (data) => {
    try {
        const { email, password } = data;  // Lấy email và password từ data
        // Tìm người dùng bằng email
        const checkUser = await GET_DB().collection('users').findOne({ email: email });
        if (!checkUser) {  // Kiểm tra nếu người dùng không tồn tại
            return {
                status: 'ERR',
                message: 'The user is not defined'
            };
        }

        // So sánh mật khẩu đã hash
        const comparePassword = bcrypt.compareSync(password, checkUser.password);
        console.log('Password match result:', comparePassword);  // Đảm bảo `comparePassword` được log ra
        if (!comparePassword) {  // Nếu mật khẩu không khớp
            return {
                status: 'ERR',
                message: 'The password is incorrect'
            };
        }

        // Tạo access và refresh token
        const access_token = await JwtService.generalAccessToken({
            id: checkUser._id,
            isAdmin: checkUser.isAdmin
        });



        const refresh_token = await JwtService.generalRefreshToken({
            id: checkUser._id,
            isAdmin: checkUser.isAdmin
        });

        console.log('retoken', refresh_token);

        // Nếu mật khẩu khớp, trả về thông tin người dùng và token
        return {
            status: StatusCodes.OK,
            message: 'Success',
            access_token,
            refresh_token
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
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteMany
};
