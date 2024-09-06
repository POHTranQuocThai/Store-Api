
import { StatusCodes } from 'http-status-codes';
import { GET_DB } from '../config/mongodb.js';
import { ProductModel } from '../models/ProductModel.js';
import { ObjectId } from 'mongodb';

const createProduct = async (data) => {
    try {
        const { name, image, type, price, countInStock, rating, description } = data
        const checkNameProduct = await GET_DB().collection('product').findOne({ name: name })
        if (checkNameProduct !== null) {
            return {
                status: StatusCodes.OK,
                message: 'The name of product is already'
            }
        }
        const newProduct = await ProductModel.createProduct(data);
    } catch (error) {
        throw error;
    }
}
const updateProduct = async (id, data) => {
    try {

        // Tìm người dùng bằng ID
        const checkProduct = await GET_DB().collection('products').findOne({ _id: new ObjectId(id) });

        if (!checkProduct) {  // Kiểm tra nếu người dùng không tồn tại
            return {
                status: StatusCodes.NOT_FOUND,
                message: 'The product is not defined'
            };
        }

        // Cập nhật người dùng
        const updatedProduct = await GET_DB().collection('products').findOneAndUpdate(
            { _id: new ObjectId(id) }, // Query to find the user by id
            { $set: data },            // Update the user data
            { returnDocument: 'after' } // Option to return the updated document
        );

        // Kiểm tra nếu cập nhật không thành công
        return {
            status: StatusCodes.OK,
            message: 'Update prooduct success',
            data: updatedProduct // Trả về `value` chứa dữ liệu cập nhật
        };

    } catch (error) {
        console.error('Error during update:', error);  // Log lỗi nếu có
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        };
    }
};
const deleteProduct = async (id) => {
    try {

        // Tìm người dùng bằng ID
        const checkProduct = await GET_DB().collection('products').findOne({ _id: new ObjectId(id) });

        if (!checkProduct) {  // Kiểm tra nếu người dùng không tồn tại
            return {
                status: StatusCodes.NOT_FOUND,
                message: 'The product is not defined'
            };
        }

        // Cập nhật người dùng
        const deletedProduct = await GET_DB().collection('products').deleteOne(
            { _id: new ObjectId(id) }// Query to find the user by id          
        )

        // Kiểm tra nếu cập nhật không thành công
        return {
            status: StatusCodes.OK,
            message: 'Delete prooduct success',
            data: deletedProduct // Trả về `value` chứa dữ liệu cập nhật
        };

    } catch (error) {
        console.error('Error during update:', error);  // Log lỗi nếu có
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        };
    }
};
const getDetailsProduct = async (id) => {
    try {

        const detailProduct = await GET_DB().collection('products').findOne({ _id: new ObjectId(id) })
        if (!detailProduct) {  // Kiểm tra nếu người dùng không tồn tại
            return {
                status: StatusCodes.NOT_FOUND,
                message: 'The product is not defined'
            };
        }
        return {
            status: StatusCodes.OK,
            message: 'Get detail product success',
            data: detailProduct // Trả về `value` chứa dữ liệu cập nhật
        };

    } catch (error) {
        console.error('Error during update:', error);  // Log lỗi nếu có
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        };
    }
};
const getAllProduct = async (limit = 8, page = 0, sort, filter) => {
    try {

        const totalProduct = await GET_DB().collection('products').countDocuments();
        if (filter) {
            const label = filter[0]
            const allProductFilter = await GET_DB().collection('products')
                .find({ [label]: { '$regex': filter[1] } })
                .limit(limit)
                .skip(limit * page)
                .toArray();
            return {
                status: StatusCodes.OK,
                message: 'Get product success',
                data: allProductFilter, // Trả về `value` chứa dữ liệu cập nhật           
            };
        }
        if (sort) {
            const objectSort = {}
            objectSort[sort[1]] = sort[0]
            const allProductSort = await GET_DB().collection('products')
                .find()
                .limit(limit)
                .skip(limit * page)
                .sort(objectSort)
                .toArray();
            return {
                status: StatusCodes.OK,
                message: 'Get product success',
                data: allProductSort, // Trả về `value` chứa dữ liệu cập nhật           
            };
        }
        // Áp dụng limit và skip trước khi chuyển cursor sang mảng
        const allProduct = await GET_DB().collection('products')
            .find()
            .limit(limit)
            .skip(limit * page)
            .toArray();
        const totalPage = Math.ceil(totalProduct / limit)
        const pageCurrent = page + 1

        if (!allProduct) {  // Kiểm tra nếu người dùng không tồn tại
            return {
                status: StatusCodes.NOT_FOUND,
                message: 'The product is not defined'
            };
        }
        return {
            status: StatusCodes.OK,
            message: 'Get product success',
            data: allProduct, // Trả về `value` chứa dữ liệu cập nhật
            totalProduct: totalProduct,
            pageCurrent: pageCurrent,
            totalPage: totalPage
        };


    } catch (error) {
        console.error('Error during update:', error);  // Log lỗi nếu có
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message
        };
    }
};

export const ProductService = {
    createProduct,
    updateProduct,
    deleteProduct,
    getDetailsProduct,
    getAllProduct
};
