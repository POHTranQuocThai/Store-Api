import Joi from "joi"
import { ObjectId } from "mongodb"
import { GET_DB } from "../config/mongodb.js";
import { StatusCodes } from "http-status-codes";



const ORDER_COLLECTION_NAME = 'orders'
const ORDER_COLLECTION_SCHEMA = Joi.object({
    orderItems: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            amount: Joi.number().required(),
            image: Joi.string().optional(),
            price: Joi.number().required(),
            product: Joi.string()
                .custom((value, helpers) => {
                    // Kiểm tra nếu giá trị có phải là ObjectId hợp lệ hay không
                    if (!ObjectId.isValid(value)) {
                        return helpers.message('"product" phải là một ObjectId hợp lệ');
                    }
                    return value;
                })
                .required()
        })
    ).required(),  // Mảng orderItems là bắt buộc
    shippingAddress: Joi.object({
        fullName: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        phone: Joi.string().required(),  // Nên dùng string để hỗ trợ các số điện thoại có ký tự đặc biệt
    }).required(),  // Địa chỉ giao hàng là bắt buộc
    paymentMethod: Joi.string().required(),
    itemsPrice: Joi.number().required(),
    shippingPrice: Joi.number().required(),
    taxPrice: Joi.number().optional(),
    totalPrice: Joi.number().required(),
    user: Joi.string()
        .custom((value, helpers) => {
            // Kiểm tra nếu giá trị có phải là ObjectId hợp lệ hay không
            if (!ObjectId.isValid(value)) {
                return helpers.message('"user" phải là một ObjectId hợp lệ');
            }
            return value;
        })
        .required(),
    isPaid: Joi.boolean().default(false),
    paidAt: Joi.date().optional(),
    isDelivered: Joi.boolean().default(false),
    deliveredAt: Joi.date().optional()
})
const validateBeforeCreate = async (data) => {
    return await ORDER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
}
const createOrder = async (data) => {
    try {
        // Validate dữ liệu
        const validData = await validateBeforeCreate(data);

        // Chèn dữ liệu vào cơ sở dữ liệu
        const createOrder = await GET_DB().collection(ORDER_COLLECTION_NAME).insertOne(validData);

        return { status: StatusCodes.OK, message: 'success', data: createOrder };
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

export const OrderModel = {
    createOrder
}