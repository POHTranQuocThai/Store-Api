
import { OrderModel } from '../models/OrderModel.js';

const createOrder = async (data) => {
    try {
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, phone, totalPrice, fullName, address, city, user } = data

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
        })

        return newOrder
    } catch (error) {
        throw error;
    }
}
export const OrderService = {
    createOrder,
};
