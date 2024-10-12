
import { ObjectId } from 'mongodb';
import { GET_DB } from '../config/mongodb.js';
import { OrderModel } from '../models/OrderModel.js';
import { StatusCodes } from 'http-status-codes';

const createOrder = async (data) => {
    try {
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, phone, totalPrice, fullName, address, city, user } = data;
        // Kiểm tra tất cả các sản phẩm trước khi tạo đơn hàng
        const productUpdates = orderItems.map(async (order) => {
            const productData = await GET_DB().collection('products').findOneAndUpdate(
                {
                    _id: new ObjectId(order.product),
                    countInStock: { $gte: order.amount }
                },
                {
                    $inc: {
                        countInStock: -order.amount, // Trừ số lượng tồn kho
                        selled: +order.amount // Tăng số lượng bán
                    }

                },
                { returnOriginal: false } // Để nhận dữ liệu sau khi cập nhật
            );

            if (productData) {
                // Tạo đơn hàng nếu sản phẩm cập nhật thành công
                const newOrder = await OrderModel.createOrder({
                    itemsPrice,
                    shippingAddress: {
                        fullName,
                        phone,
                        address,
                        city
                    },
                    paymentMethod,
                    totalPrice,
                    orderItems,
                    shippingPrice,
                    user
                });
                return newOrder
            }
        })

        const result = await Promise.all(productUpdates);
        const newData = result && result.filter((item) => item.id)
        if (newData.length) {
            return {
                status: 'ERR',
                message: `Sản phẩm với id${newData.join(',')} không đủ hàng`
            }
        }
        return {
            status: StatusCodes.OK,
            message: `Success`
        }
    } catch (error) {
        console.error('Lỗi khi tạo đơn hàng:', error);
        throw error;
    }
};

const getDetailsOrder = async (id) => {
    try {

        const detailOrder = await GET_DB().collection('orders').findOne({ user: id })
        if (!detailOrder) {  // Kiểm tra nếu người dùng không tồn tại
            return {
                status: StatusCodes.NOT_FOUND,
                message: 'The order is not defined'
            };
        }
        return {
            status: StatusCodes.OK,
            message: 'Get detail order success',
            data: detailOrder // Trả về `value` chứa dữ liệu cập nhật
        };

    } catch (error) {
        console.error('Error during update:', error);  // Log lỗi nếu có
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        };
    }
};
export const OrderService = {
    createOrder,
    getDetailsOrder
};
