import { StatusCodes } from "http-status-codes"
import { ProductService } from "../services/ProductService.js"


const createProduct = async (req, res) => {
    try {
        console.log(req.body)
        const { name, image, type, price, countInStock, rating, description } = req.body
        if (!name || !image || !type || !price || !countInStock || !rating || !description) {
            return res.status(StatusCodes.OK).json({ status: 'ERR', message: 'The input is required' })
        }
        const newProduct = await ProductService.createProduct(req.body)
        return res.status(StatusCodes.CREATED).json(newProduct)
    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: error })
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
    getAllProduct
}