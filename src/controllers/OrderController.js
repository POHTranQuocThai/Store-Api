import { StatusCodes } from "http-status-codes"
import { OrderService } from "../services/OrderService.js"


const createOrder = async (req, res) => {
    try {
        const { paymentMethod, itemsPrice, shippingPrice, phone, totalPrice, fullName, address, city } = req.body;
        // Kiểm tra các trường bắt buộc
        if (!paymentMethod || !itemsPrice || !shippingPrice || !phone || !totalPrice || !fullName || !address || !city) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: 'ERR', message: 'The input is required' });
        }

        // Gọi hàm tạo sản phẩm và log ra sản phẩm
        const newOrder = await OrderService.createOrder(req.body);

        return res.status(StatusCodes.CREATED).json(newOrder);
    } catch (error) {
        // Trả về mã lỗi chi tiết hơn nếu cần
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'ERR',
            message: 'An error occurred while creating the order',
            error: error.message,
        });
    }
}

export const OrderController = {
    createOrder,
}