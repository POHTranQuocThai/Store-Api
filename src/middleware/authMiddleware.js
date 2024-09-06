import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { StatusCodes } from 'http-status-codes'
dotenv.config()

const auth = (req, res, next) => {
    try {
        // Lấy token từ headers, kiểm tra nếu không có token
        const authHeader = req.headers.token;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // Xác thực token
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
            if (err) {
                return res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid token' });
            }

            const { payload } = user;

            // Kiểm tra quyền admin
            if (payload?.isAdmin) {
                next();
            } else {
                return res.status(StatusCodes.FORBIDDEN).json({ message: 'User is not authorized' });
            }
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};
const authUser = (req, res, next) => {
    try {
        // Lấy token từ headers, kiểm tra nếu không có token
        const authHeader = req.headers.token;
        const userId = req.params.id
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // Xác thực token
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
            if (err) {
                return res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid token' });
            }

            const { payload } = user;

            // Kiểm tra quyền admin
            if (payload?.isAdmin || payload?.id === userId) {
                next();
            } else {
                return res.status(StatusCodes.FORBIDDEN).json({ message: 'User is not authorized' });
            }
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};
export const authMiddleware = {
    auth, authUser
}