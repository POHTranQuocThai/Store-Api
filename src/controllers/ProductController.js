import { StatusCodes } from "http-status-codes"
import { ProductService } from "../services/ProductService.js"


const createProduct = async (req, res) => {
    try {
        const { name, image, type, price, countInStock, rating, description } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!name || !image || !type || !price || !countInStock || !rating || !description) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: 'ERR', message: 'The input is required' });
        }

        // Gọi hàm tạo sản phẩm và log ra sản phẩm
        const newProduct = await ProductService.createProduct(req.body);
        console.log('Product Created:', newProduct);

        return res.status(StatusCodes.CREATED).json(newProduct);
    } catch (error) {
        // Log chi tiết lỗi
        console.error('Error creating product:', error);

        // Trả về mã lỗi chi tiết hơn nếu cần
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'ERR',
            message: 'An error occurred while creating the product',
            error: error.message,
        });
    }
}

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const data = req.body

        if (!productId) {
            return res.status(StatusCodes.OK).json({ message: 'The product is required' })
        }
        const response = await ProductService.updateProduct(productId, data)
        console.log('res', response);

        return res.status(StatusCodes.OK).json(response)
    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: error })
    }
}
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id

        if (!productId) {
            return res.status(StatusCodes.OK).json({ message: 'The product is required' })
        }
        const response = await ProductService.deleteProduct(productId)
        return res.status(StatusCodes.OK).json(response)
    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: error })
    }
}
const deleteMany = async (req, res) => {
    try {
        const ids = req.body.ids
        console.log('ids', ids);

        if (!ids) {
            return res.status(StatusCodes.OK).json({ message: 'The ids is required' })
        }
        const response = await ProductService.deleteMany(ids)
        return res.status(StatusCodes.OK).json(response)
    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: error })
    }
}
const getDetailsProduct = async (req, res) => {
    try {
        const detailProductId = req.params.id
        const response = await ProductService.getDetailsProduct(detailProductId)
        return res.status(StatusCodes.OK).json(response)
    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: error })
    }
}
const getAllProduct = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query
        const response = await ProductService.getAllProduct(Number(limit), Number(page), sort, filter)
        return res.status(StatusCodes.OK).json(response)
    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: error })
    }
}
export const ProductController = {
    createProduct,
    updateProduct,
    deleteProduct,
    getDetailsProduct,
    getAllProduct,
    deleteMany
}