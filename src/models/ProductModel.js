

const PRODUCT_COLLECTION_NAME = 'products'
const PRODUCT_COLLECTION_SCHEMA = Joi.object({
    name: Joi.string().required(),  // Bỏ .valid(1) để name có thể là bất kỳ chuỗi nào
    image: Joi.string().uri(),  // Kiểm tra nếu image là một URL hợp lệ
    type: Joi.string().required(),
    price: Joi.number().required().default(0),  // Đặt giá trị mặc định là 0 nếu không được cung cấp
    countInStock: Joi.string(),  // Chuyển đổi từ number sang string nếu bạn muốn hỗ trợ số điện thoại
    rating: Joi.number(),
    description: Joi.string()
})

const createNew = (data) => {
    try {

    } catch (error) {

    }
}

export const ProductModel = {
    createNew
}