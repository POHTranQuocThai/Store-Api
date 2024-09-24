import Joi from "joi";
import { GET_DB } from "../config/mongodb.js";
import { StatusCodes } from "http-status-codes";


const PRODUCT_COLLECTION_NAME = 'products'
const PRODUCT_COLLECTION_SCHEMA = Joi.object({
    name: Joi.string().required(),  // Bỏ .valid(1) để name có thể là bất kỳ chuỗi nào
    image: Joi.string(),  // Kiểm tra nếu image là một URL hợp lệ
    type: Joi.string().required(),
    price: Joi.number().required().default(0),  // Đặt giá trị mặc định là 0 nếu không được cung cấp
    countInStock: Joi.number(),  // Chuyển đổi từ number sang string nếu bạn muốn hỗ trợ số điện thoại
    rating: Joi.number(),
    discount: Joi.number(),
    selled: Joi.number(),
    description: Joi.string()
})
const validateBeforeCreate = async (data) => {
    return await PRODUCT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
}
const createProduct = async (data) => {
    try {
        // Validate dữ liệu
        const validData = await validateBeforeCreate(data);
        // Chèn dữ liệu vào cơ sở dữ liệu
        const createProduct = await GET_DB().collection(PRODUCT_COLLECTION_NAME).insertOne(validData);

        return { status: StatusCodes.OK, message: 'success', data: createProduct }
    } catch (error) {
        throw error;
    }
};

export const ProductModel = {
    createProduct
}