import express from 'express'
import AsyncExitHook from 'async-exit-hook'
import { ClOSE_DB, CONNECT_DB } from './config/mongodb.js'
import { APIs_V1 } from './routes/v1/index.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

const START_SERVER = async () => {
    const app = express()
    const port = process.env.LOCAL_DEV_APP_PORT || 3001

    // Cấu hình CORS
    app.use(cors({
        origin: 'http://localhost:3000', // Địa chỉ frontend
        credentials: true, // Cho phép gửi cookie
    }));

    // Cấu hình xử lý JSON và URL-encoded
    app.use(express.json({ limit: '50mb' }))
    app.use(express.urlencoded({ limit: '50mb', extended: true })) // Không cần body-parser
    //app.use(bodyParser.json())
    // Cấu hình cookie parser
    app.use(cookieParser())

    // Định tuyến API v1
    app.use('/v1', APIs_V1)

    // Bắt đầu server
    app.listen(port, () => {
        console.log(`I am running at http://localhost:${port}`)
    })

    // Đăng ký hook thoát để đóng kết nối DB
    AsyncExitHook((signal) => {
        ClOSE_DB()
    })
}

// Kết nối tới MongoDB và khởi động server
CONNECT_DB()
    .then(() => console.log('Connected MongoDB'))
    .then(() => START_SERVER())
    .catch(error => {
        console.error(error)
        process.exit(1) // Thoát với mã lỗi 1 nếu có lỗi
    })
