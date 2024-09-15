import Joi from 'joi'
import { GET_DB } from '../config/mongodb.js'
import bcrypt from 'bcryptjs'
import { StatusCodes } from 'http-status-codes';

const USER_COLLECTION_NAME = 'users'

const USER_COLLECTION_SCHEMA = Joi.object({
    name: Joi.string(),
    email: Joi.string().email().required(), // Xác nhận định dạng email hợp lệ
    password: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')), // Xác nhận confirmPassword khớp với password
    isAdmin: Joi.boolean().default(false), // Đặt giá trị mặc định là false
    phone: Joi.string().optional(), // Thay đổi từ number thành string và không bắt buộc
    address: Joi.string().optional(),
    avatar: Joi.string().optional(),
    createdAt: Joi.date().default(() => new Date()),
    updatedAt: Joi.date().default(() => new Date())
});

const validateBeforeCreate = async (data) => {
    return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createNew = async (data) => {
    try {
        // Validate dữ liệu
        const validData = await validateBeforeCreate(data);

        // Tạo hash cho password
        const hash = bcrypt.hashSync(validData.password, 10);

        // Tạo dữ liệu mới với password đã được hash
        const newValidData = {
            ...validData,
            password: hash,
            confirmPassword: hash
        };

        // Chèn dữ liệu vào cơ sở dữ liệu
        const createUser = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(newValidData);

        return { status: StatusCodes.OK, message: 'success', data: createUser }
    } catch (error) {
        throw error;
    }
};

export const UserModel = {
    createNew
};
